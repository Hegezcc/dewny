import {MessageEmbed, MessageAttachment} from "discord.js";
import Sequelize from "sequelize";

// Use custom replacer to allow stringifying even when response has circular references
// See: https://stackoverflow.com/a/11616993/5770507
function getReplacer() {
    const cache = new Set();

    return (key, value) => {
        if (typeof value === 'object' && value !== null) {
            if (cache.has(value)) {
                // Circular reference found
                try {
                    // If this value does not reference a parent it can be deduped
                    return JSON.parse(JSON.stringify(value));
                } catch (err) {
                    // discard key if value cannot be deduped
                    return;
                }
            }
            // Store value in our set
            cache.add(value);
        }
        return value;
    }
}

export const postMessage = (content, channel, verb, config, fileName = 'message.txt', codify = false) => {
    if (content.length > config.discordCharacterLimit) {
        let newContent;
        if (codify) {
            newContent = '```\n' + content.slice(0, config.discordCharacterLimit) + '\n```(truncated)';
        } else {
            newContent = content.slice(0, config.discordCharacterLimit) + '… (truncated)';
        }

        const file = new MessageAttachment(Buffer.from(content), fileName);

        return channel[verb](newContent, file);
    } else {
        if (codify) {
            content = '```\n' + content + '\n```';
        }

        return channel[verb](content);
    }
}

export const repostOldMessages = async (bot, db, config, logger) => {
    logger.debug('[Discord] Checking for old unsent messages...');

    const messages = await db.models.messages.findAll({
        attributes: {
            include: [
                [Sequelize.literal(
                    '(' + db.dialect.queryGenerator.selectQuery('users', {
                        attributes: ['discord_id'],
                        where: {
                            'id': {
                                [Sequelize.Op.eq]: db.col('key.user_id')
                            },
                        }
                    }).slice(0, -1) + ')'
                ), 'key.discordId']
            ]
        },
        include: [
            {model: db.models.keys, required: true},
        ]
    });

    if (messages.length === 0) {
        return;
    }

    logger.info(`[Discord] Old unsent messages found: ${messages.length}`);

    const statuses = [];

    for (let msg of messages) {
        try {
            const channel = await (msg.key.channelId !== null
                ? bot.channels.fetch(msg.key.channelId.toString())
                : bot.users.fetch(msg.key.get('discordId').toString()));

            // This may fail with DiscordAPIError
            await postMessage(msg.data, channel, 'send', config);

            // Allow removing this message
            statuses.push({id: msg.id, status: true});

            logger.info(`[Discord] Previously unsent message sent now, discordId=${msg.key.get('discordId')}, apiKey=${msg.key.secret}, message.length=${msg.data.length}, createdAt=${msg.createdAt}`);
        } catch (e) {
            statuses.push({id: msg.id, status: false});

            logger.info(`[Discord] Previously unsent message kept unsent as error occurred, discordId=${msg.key.get('discordId')}, apiKey=${msg.key.secret}, message.length=${msg.data.length}, createdAt=${msg.createdAt}, error=${e.toString()}`);
        }

        const toDestroy = statuses.filter(x => x.status).map(x => x.id)

        await db.models.messages.destroy({
            where: {
                id: {
                    [Sequelize.Op.in]: toDestroy
                }
            }
        });

        logger.info(`[Discord] Successfully resent and removed total ${toDestroy.length} overlying messages, ${statuses.length - toDestroy.length} messages still kept unsent`);
    }
}

export const commands = [
    {
        name: ['help'],
        description: 'Show help for specified command (or all commands).',
        arguments: [
            {name: 'command', optional: true, description: 'Command to search help for.'}
        ],
        enabled: true,
        action(scope) {
            const filtered = commands.map(cmd => {
                let enabled = cmd.enabled;
                if (typeof enabled === 'function') {
                    enabled = enabled(scope);
                }

                return {...cmd, enabled};
            }).filter(cmd => cmd.enabled);

            const embed = new MessageEmbed()
                .setAuthor(scope.bot.user.username, scope.bot.user.displayAvatarURL()) // TODO: Add bot URL
                .setTimestamp();

            if (scope.args.length > 0 && scope.args[0]) {
                // Specific command
                const cmd = filtered.find(x => x.name.includes(scope.args[0]));

                // If no command found return early with graceful error message
                if (typeof cmd === 'undefined') {
                    scope.msg.reply('no command by this name exists!')
                    return;
                }

                embed.setTitle(`Help for "${scope.args[0]}"`)
                    .addField('Command syntax', `${scope.config.botPrefix}${scope.args[0]}` + cmd.arguments.map(x => x.optional ? ` (${x.name})` : ` ${x.name}`).join(''))
                    .addField('Description', cmd.description);

                if (cmd.name.length > 1) {
                    embed.addField('Aliases', cmd.name.filter(x => x !== scope.args[0]).map(x => scope.config.botPrefix + x).join(', '));
                }

                if (cmd.arguments.length > 0) {
                    embed.addField('Arguments', cmd.arguments.map(x => x.name), true)
                        .addField('Type', cmd.arguments.map(x => x.optional ? 'optional' : 'required'), true)
                        .addField('Description', cmd.arguments.map(x => x.description), true);
                } else {
                    embed.addField('Command arguments', '(none)');
                }
            } else {
                // All commands
                embed.setTitle(`Help for all commands`)
                    .addField('Command name', filtered.map(cmd => `${scope.config.botPrefix}${cmd.name[0]}` + cmd.arguments.map(x => x.optional ? ` (${x.name})` : ` ${x.name}`).join('')), true)
                    .addField('Description', filtered.map(cmd => cmd.description), true)
            }

            scope.msg.reply(embed);
        }
    },
    {
        name: ['ping'],
        description: 'Tell if bot is still alive.',
        arguments: [],
        enabled: true,
        action(scope) {
            scope.msg.reply('Pong!');
        }
    },
    {
        name: ['exec', 'execute'],
        description: 'Execute an expression.',
        arguments: [
            {
                name: 'expression',
                optional: false,
                description: 'A Javascript expression to be eval(...)\'d. Variable "scope" is available. {...} syntax can be used for larger code bodies, but must return a value.'
            }
        ],
        enabled: scope => scope.config.admins.includes(scope.msg.author.id),
        async action(scope) {
            // One additional check here so eval(...) is gated even if a hacker could somehow call arbitrary action
            if (!scope.config.admins.includes(scope.msg.author.id)) return;

            try {
                const cache = new Set();

                const replacer = getReplacer();

                const result = await eval(`(async () => ${scope.args.join(' ')})()`);
                const response = JSON.stringify(result, replacer, 2);

                postMessage(response, scope.msg, 'reply', scope.config, 'result.json', true);
            } catch (e) {
                scope.msg.reply(`Error: \`\`\`\n${e.toString()}\n\`\`\``)
            }
        }
    }
];