#!/usr/bin/env node
// Require everything

import winston from "winston";
import Sequelize from "sequelize";
import Discord from "discord.js";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

import config from "../config/config.mjs";
import auth from "../config/auth.json";
import { commands, postMessage, repostOldMessages } from "./discord.mjs";

import KeysModel from '../models/keys.js';
import MessagesModel from '../models/messages.js';
import UsersModel from '../models/users.js';

// Initialize logger
const logger = winston.createLogger({
    level: config.logLevel.console,
    format: winston.format.json(),
    defaultMeta: {service: 'user-service'},
    transports: [
        new winston.transports.File({
            filename: 'logs/error.log',
            level: config.logLevel.file,
            handleExceptions: true,
            maxsize: 5242880, // 5MB
        }),
    ],
    exitOnError: false,
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
        ),
    }));
}

logger.info('[Logger] Logger initialized.');

// Initialize database and its functions
const db = new Sequelize(auth.database.database, auth.database.username, auth.database.password, auth.database.options);
db.options.logging = (...attrs) => {return {log: logger.debug(...attrs)}};

db.authenticate()
    .then(() => logger.info('[DB] Connection has been established successfully.'))
    .catch(err => logger.error('[DB] Unable to connect to the database:', err));

// Quite a hacky way to register these models to Sequelize, but hey, it works ":D"
// Thank Sequelize for not updating their documentation or syntax for ES2015+ modules
KeysModel(db);
MessagesModel(db);
UsersModel(db);

db.models.keys.hasMany(db.models.messages);
db.models.keys.belongsTo(db.models.users);
db.models.messages.belongsTo(db.models.keys);
db.models.users.hasMany(db.models.keys);

// Start our Discord instance
const bot = new Discord.Client({ partials: ['USER']} );

bot.on('ready', () => {
    logger.info('[Discord] Discord client connected!');
    logger.info(`[Discord] Logged in as ${bot.user.username}#${bot.user.discriminator} (<@${bot.user.id}>)`);
    bot.user.setActivity(`internet - ${config.botPrefix}help for usage`, {type: "WATCHING"}).catch(logger.error);
});

bot.on('message', msg => {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that start with config.botPrefix
    if (msg.content.startsWith(config.botPrefix)) {
        const args = msg.content.substring(config.botPrefix.length).split(' ').filter(x => x.length > 0);
        const cmd = args.shift();

        const found = commands.find(x => x.name.includes(cmd));

        if (found) {
            let enabled = found.enabled;

            if (typeof found.enabled === 'function') {
                found.enabled = found.enabled({config, msg});
            }

            if (enabled) {
                logger.info(`[Discord] ${msg.author.username}#${msg.author.discriminator} (<@${msg.author.id}>) sent a command: ${msg.content}`)
                found.action({msg, args, config, logger, bot, cmd});
            }
        }
    }
});

bot.on('userUpdate', (oldUser, newUser) => {
    // Allow event to fire even on unloaded users
    if (newUser.partial) {
        newUser = bot.users.fetch(newUser.id);
    }

    // Update username and avatar in database
    db.models.users.update({
        avatarUrl: newUser.avatar,
        username: `${newUser.username}#${newUser.discriminator}`,
    }, {
        where: {
            discordId: newUser.id,
        }
    }).then(() => logger.info(`[Discord] User ${newUser.username}#${newUser.discriminator} (<@${newUser.id}>) updated successfully.`));
})

bot.on('error', e => {
    logger.error(`[Discord] Error: ${e.toString()}`);
});

bot.login(auth.discord_key).catch(logger.error);

// Discord notification handler
async function postNotification(discordId, apiKey, message, channelId, ipAddress) {
    logger.info(`[Express] New API call: discordId=${discordId}, apiKey=${apiKey}, message.length=${message.length}`);

    let user;
    try {
        user = await bot.users.fetch(discordId);
    } catch (e) {
        logger.error(`[Express] Error @ postNotification while fetching user: ${e.toString()} (${ipAddress})`);

        if (e.name === 'DiscordAPIError') {
            return {
                code: 404,
                data: {
                    status: 'error',
                    message: 'This user does not exist.',
                    error: e.toString(),
                }
            }
        }
    }

    logger.debug('User found')

    let channel;
    try {
        if (channelId === null) {
            logger.debug('Retrieving user DM channel')
            channel = user;
        } else {
            logger.debug('Retrieving guild channel')
            channel = await bot.channels.fetch(channelId.toString())
        }
    } catch (e) {
        logger.error(`[Express] Error @ postNotification while fetching channel: ${e.toString()} (${ipAddress})`);

        if (e.name === 'DiscordAPIError') {
            return {
                code: 404,
                data: {
                    status: 'error',
                    message: 'This channel cannot be found.',
                    error: e.toString(),
                }
            }
        }
    }

    logger.debug(`Channel found: ${channel}`)

    return await postMessage(message, channel, 'send', config).then(() => {
        logger.info(`[Express] Notify request success (${ipAddress})`);
        logger.debug('Message posted')

        return {
            code: 200,
            data: {
                status: 'ok',
                message: 'Message succesfully sent'
            }
        }

    }).catch((e) => {
        logger.error(`[Express] Error @ postNotification while posting message: ${e.toString()} (${ipAddress})`);

        return {
            code: 500,
            data: {
                status: 'error',
                message: e.toString(),
            }
        }
    });
}

async function notifyHandler(req, res) {
    const discordId = req.params.discordId ?? req.body.discord_id ?? req.query.discord_id;
    const apiKey = req.params.apiKey ?? req.get('x-api-key') ?? req.body.api_key ?? req.query.api_key;
    const message = req.params.message ?? req.body.message ?? req.query.message;

    if (!discordId) {
        logger.info(`[Express] Notify request error: No Discord ID specified (${req.ip})`);
        res.status(400).json({status: 'error', message: 'Discord ID must be specified.'});
        return;
    }

    if (!apiKey) {
        logger.info(`[Express] Notify request error: No API key specified (${req.ip})`);
        res.status(400).json({status: 'error', message: 'API key must be specified.'});
        return;
    }

    if (!message) {
        logger.info(`[Express] Notify request error: No message specified (${req.ip})`);
        res.status(400).json({status: 'error', message: 'Message must be specified.'});
        return;
    }

    // Authorize user
    const keyInstance = await db.models.keys.findOne({
        where: {
            userId: { // Basically a subquery: where user_id = (select id from users where discord_id = ?)
                [Sequelize.Op.eq]: Sequelize.literal(
                    '(' + db.dialect.queryGenerator.selectQuery('users', {
                        attributes: ['id'],
                        where: {
                            discord_id: discordId,
                        }
                    }).slice(0, -1) + ')'
                )
            },
            secret: apiKey
        }
    });

    if (keyInstance === null) {
        logger.info(`[Express] Notify request error: Invalid Discord ID or API key provided (${req.ip})`);
        res.status(403).json({status: 'error', message: 'Invalid Discord ID or API key provided.'});
        return;
    }

    const resp = await (postNotification(discordId, apiKey, message, keyInstance.channelId, req.ip).catch(logger.error));

    if (resp.data.status === 'ok' ?? false) {
        // Update lastUsedAt and lastIpAddress
        keyInstance.lastIpAddress = req.ip;
        keyInstance.lastUsedAt = Sequelize.literal('CURRENT_TIMESTAMP');
        keyInstance.messageCount = Sequelize.literal('message_count + 1');
        keyInstance.save();
    } else if (resp.data.status === 'error' && resp.code === 500) {
        // In case of failure on Discord end, store message to DB for further sending
        try {
            await db.models.messages.create({
                data: message,
                keyId: keyInstance.id,
            });
            resp.data.message += ' (message was saved to database for further sending)';
            logger.info(`[DB] Discord API fallback: message succesfully saved to database`);
        } catch (e) {
            logger.error(`[DB] Discord API fallback: An error occurred while trying to save message to database: ${e.toString()}`);
            resp.data.message += ' (message was NOT saved to database)';
        }
    }

    res.status(resp.code).json(resp.data);
}

// Initialize web server
const app = express();

// Use POST body parser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(bodyParser.raw());

// CORS rules
app.use(cors({origin: config.express.frontendHosts}));

app.get('/api/ping', (req, res) => {
    logger.info(`[Express] Ping from ${req.ip}`);
    res.json({status: 'ok', message: 'pong!'});
});

app.route('/api/notify/:discordId(\\d+)?/:apiKey?/:message?')
    .get(notifyHandler)
    .post(notifyHandler);

app.listen(config.express.port, () => logger.info(`[Express] Listening for API requests on port ${config.express_port}`));

// Keep checking for unsent messages and sending them when we can
setTimeout(repostOldMessages, 5000, bot, db, config, logger);
setInterval(repostOldMessages, 10000, bot, db, config, logger)