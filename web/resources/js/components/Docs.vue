<template>
    <div class="container py-3">
        <div class="row">
            <div class="col-12">
                <h1>API Documentation</h1>
                <hr>
            </div>
        </div>
        <div class="row">
            <div class="col-12">
                <div class="card border border-primary">
                    <div class="card-header">
                        <h2 class="mb-0">Installation</h2>
                    </div>
                    <div class="card-body">
                        <p>
                            Installation and configuration options for the service, which is ran in two parts: Node.js
                            and Laravel apps utilizing the same database.
                        </p>
                        <button class="btn btn-primary" type="button" data-toggle="collapse"
                                data-target="#docsCollapseInstall" aria-expanded="false"
                                aria-controls="docsCollapseInstall">
                            Show documentation
                        </button>
                        <div class="collapse" id="docsCollapseInstall">
                            <h3 class="mt-5">Prerequisites</h3>
                            <ul>
                                <li>Discord client and account</li>
                                <li>Node.js, npm and nvm on your system</li>
                                <li>Sequelize-compatible database configured, e.g. MySQL, PostgreSQL or SQLite</li>
                                <li><a href="https://discord.com/developers/applications">Discord application and bot
                                    user</a></li>
                                <li>Project cloned to your server of choice</li>
                            </ul>
                            <div class="card border border-primary my-3">
                                <div class="card-body py-2">
                                    <p class="my-0">
                                        <b>Note:</b> service relies heavily on 64-bit Twitter snowflakes as identifiers.
                                        In Discord, you should go to <em>Settings > Appearance > Advanced</em> and
                                        toggle <em>Developer mode</em> on. It allows you to right-click and <em>Copy
                                        ID</em> those useful identifiers.
                                    </p>
                                </div>
                            </div>
                            <h3 class="mt-5">Configuration</h3>
                            <h4 class="mt-3">Node</h4>
                            <ul>
                                <li>Use command line to navigate to <code>node/</code> folder in the project and run
                                    <code>nvm use</code> and<code>npm install</code> . You should also install your
                                    preferred database driver, e.g. with <code>npm install mysql2</code> . <small><a
                                        href="https://sequelize.org/v5/manual/getting-started.html">More
                                        info</a></small></li>
                                <li>Copy <code>node/config/auth.example.json</code> to
                                    <code>node/config/auth.json</code> and configure it to match your credentials.</li>
                                <li>Copy <code>node/config/config.example.mjs</code> to
                                    <code>node/config/config.mjs</code> and configure it to match your setup.</li>
                                <li>Test the app by running <code>npm run start</code> . If no errors show up, you are
                                    good to continue. In this documentation we are using
                                    <code>{{ $root.apiRoutes.node }}</code> to signify Node.js API URLs. If service is
                                    configured right, this would be a live URL for the API.
                                </li>
                            </ul>
                            <div class="card border border-primary my-3">
                                <div class="card-body py-2">
                                    <p class="my-0">
                                        <b>Note:</b> you might want to daemonize the Node.js app to run as a service, so
                                        it is always running at background. Depending on your system, you may use either
                                        your OS services (e.g.
                                        <a href="https://nodesource.com/blog/running-your-node-js-app-with-systemd-part-1/">Systemd</a>,
                                        <a href="http://bestirtech.com/blog/2019/02/node-windows-service-node-js-app/">node-windows</a>),
                                        <a href="https://pm2.keymetrics.io/docs/usage/quick-start/">PM2</a>
                                        or for quick testing,
                                        <a href="https://stackoverflow.com/questions/26245942/how-do-i-leave-node-js-server-on-ec2-running-forever">screen</a>/<a
                                        href="https://www.howtogeek.com/671422/how-to-use-tmux-on-linux-and-why-its-better-than-screen/">tmux</a>.
                                        <a href="https://stackoverflow.com/questions/4018154/how-do-i-run-a-node-js-app-as-a-background-service">
                                            This page</a> has more info about possible solutions.
                                    </p>
                                </div>
                            </div>
                            <h4 class="mt-3">Laravel</h4>
                            <ul>
                                <li>Configure your web server to satisfy <a
                                    href="https://laravel.com/docs/7.x#server-requirements"
                                    target="_blank">requirements</a>
                                    for running Laravel.
                                </li>
                                <li>Point your web directory to <code>web/public/</code> .</li>
                                <li>Copy <code>web/.env.example</code> to <code>web/.env</code> and set your database
                                    &amp; Discord application credentials on that file.
                                </li>
                                <li>On command line, navigate to <code>web/</code> and run the following commands:
                                    <ul>
                                        <li><code>composer install</code></li>
                                        <li><code>npm install</code></li>
                                        <li><code>php artisan key:generate</code></li>
                                        <li><code>php artisan migrate</code></li>
                                    </ul>
                                </li>
                                <li>If no errors occurred, you should now be able to navigate to the app in web browser.
                                    In this documentation we are using <code>{{ $root.apiRoutes.index }}</code> to
                                    signify
                                    Laravel URLs. This should be the live URL of this service.
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-12 mt-3">
                <div class="card border border-success">
                    <div class="card-header">
                        <h2 class="mb-0">Node.js</h2>
                    </div>
                    <div class="card-body">
                        <p>
                            The always-running Node.js app is responsible for interacting with Discord API and receiving
                            service requests to the Express API. It is the fundamental endpoint for this service.
                        </p>
                        <button class="btn btn-success" type="button" data-toggle="collapse"
                                data-target="#docsCollapseNode" aria-expanded="false" aria-controls="docsCollapseNode">
                            Show documentation
                        </button>
                        <div class="collapse" id="docsCollapseNode">
                            <h3 class="mt-5">Discord bot commands</h3>
                            <div class="card border border-secondary mb-3">
                                <div class="card-header bg-white">
                                    <pre class="mb-0 user-select-all"><span class="text-secondary">d!</span><span
                                        class="text-dark font-weight-bold">help</span></pre>
                                    <pre class="mb-0 user-select-all"><span class="text-secondary">d!</span><span
                                        class="text-dark font-weight-bold">help <b>&lt;command&gt;</b></span></pre>
                                </div>
                                <div class="card-body">
                                    <p>Show help for specified command (or all commands).</p>
                                    <div class="table-responsive">
                                        <table class="table mb-0">
                                            <thead class="thead-light">
                                            <tr>
                                                <th>Argument</th>
                                                <th>Type</th>
                                                <th>Description</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            <tr>
                                                <td>command</td>
                                                <td>optional</td>
                                                <td>Command to search help for.</td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            <div class="card border border-secondary mb-3">
                                <div class="card-header bg-white">
                                    <pre class="mb-0 user-select-all"><span class="text-secondary">d!</span><span
                                        class="text-dark font-weight-bold">ping</span></pre>
                                </div>
                                <div class="card-body">
                                    <p>Tell if (Discord) bot is still alive.</p>
                                    <p class="mb-0">Command has no arguments.</p>
                                </div>
                            </div>
                            <div class="card border border-secondary mb-3">
                                <div class="card-header bg-white">
                                    <pre class="mb-0 user-select-all"><span class="text-secondary">d!</span><span
                                        class="text-dark font-weight-bold">exec &lt;expression&gt;</span></pre>
                                    <pre class="mb-0 user-select-all"><span class="text-secondary">d!</span><span
                                        class="text-dark font-weight-bold">execute &lt;expression&gt;</span></pre>
                                </div>
                                <div class="card-body">
                                    <p>Execute an expression. Note that using this command requires user to be set as
                                        admin in <code>node/config/config.mjs</code> .</p>
                                    <div class="table-responsive">
                                        <table class="table mb-0">
                                            <thead class="thead-light">
                                            <tr>
                                                <th>Argument</th>
                                                <th>Type</th>
                                                <th>Description</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            <tr>
                                                <td>expression</td>
                                                <td>required</td>
                                                <td>A Javascript expression to be <code>eval(...)</code>'d. Variable
                                                    <em>scope</em> is available with keys <em>msg</em>, <em>args</em>,
                                                    <em>config</em>, <em>logger</em>, <em>bot</em> and <em>cmd</em>
                                                    exposed.
                                                    <code>{...}</code> syntax can be used for larger code bodies, but
                                                    must return a value.
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <h4>Examples</h4>
                                    <pre class="mb-0">
<span class="user-select-all">d!exec 1+1</span>
<span class="user-select-all">d!exec scope.config</span>
<span class="user-select-all">d!exec scope.bot.users</span>
<span
    class="user-select-all">d!exec scope.bot.users.fetch("733574765100663053").then(u => u.send('Hello World!'))</span>
<span
    class="user-select-all">d!exec {try {(await scope.bot.users.fetch("733574765100663053"))} catch (e) {return e;}}</span></pre>
                                </div>
                            </div>
                            <h3 class="mt-5">API endpoints</h3>
                            <div class="card border border-secondary">
                                <div class="card-header bg-white">
                                    <p class="my-0"><span class="badge badge-secondary">GET</span></p>
                                    <pre class="mb-0 user-select-all"><span
                                        class="text-secondary">{{ $root.apiRoutes.node }}</span><span
                                        class="text-dark font-weight-bold">/api/ping</span></pre>
                                </div>
                                <div class="card-body">
                                    <p>
                                        This endpoint is provided to check if the Express server is still alive. If bot
                                        does not respond, it still might not mean it is dead, as it may still be
                                        authenticated to Discord API and respond to commands via that way.
                                    </p>
                                    <h4>Parameters:</h4>
                                    <p>None.</p>
                                    <h4>Return value</h4>
                                    <p>Static JSON response is returned. It is an object with <em>status</em> and <em>message</em>
                                        properties. Example:</p>
                                    <div class="card card-body p-2 mb-3">
                                        <pre class="mb-0 user-select-all">{"status":"ok","message":"pong!"}</pre>
                                    </div>
                                    <h4>Status codes</h4>
                                    <ul>
                                        <li><code>200</code> : all is good, server is alive.</li>
                                        <li>Anything else, including no response at all: something is wrong.</li>
                                    </ul>
                                    <h4>Javascript example with <code>fetch()</code> :</h4>
                                    <div class="card card-body p-2">
                                        <pre class="mb-0 user-select-all">
fetch('{{ $root.apiRoutes.node }}/api/ping', {
    method: 'GET',
})
    .then(r => r.json())
    .then(console.log);</pre>
                                    </div>
                                </div>
                            </div>
                            <div class="card border border-secondary mt-3">
                                <div class="card-header bg-white">
                                    <p class="my-0">
                                        <span class="badge badge-secondary">GET</span>
                                        <span class="badge badge-primary">POST</span></p>
                                    <pre class="mb-0 user-select-all"><span
                                        class="text-secondary">{{ $root.apiRoutes.node }}</span><span
                                        class="text-dark font-weight-bold">/api/notify</span></pre>
                                    <pre class="mb-0 user-select-all"><span
                                        class="text-secondary">{{ $root.apiRoutes.node }}</span><span
                                        class="text-dark font-weight-bold">/api/notify/&lt;discord_id&gt;</span></pre>
                                    <pre class="mb-0 user-select-all"><span
                                        class="text-secondary">{{ $root.apiRoutes.node }}</span><span
                                        class="text-dark font-weight-bold">/api/notify/&lt;discord id&gt;/&lt;secret key&gt;</span></pre>
                                    <pre class="mb-0 user-select-all"><span
                                        class="text-secondary">{{ $root.apiRoutes.node }}</span><span
                                        class="text-dark font-weight-bold">/api/notify/&lt;discord id&gt;/&lt;secret key&gt;/&lt;message&gt;</span></pre>
                                </div>
                                <div class="card-body">
                                    <p>
                                        The endpoint <code>/api/notify</code> takes three parameters: <em>Discord
                                        ID</em>, <em>secret key</em> and <em>message</em>. You can provide those
                                        positionally in the URI, in POST body (JSON and URL encoded format accepted), or
                                        GET query string. You can also provide the secret key via <code>X-Api-Key</code>
                                        header. This endpoint semantically prefers POST request, but due to limitations
                                        in some ways to send web requests, GET requests are allowed too, and the
                                        endpoint is very liberal in parsing input.
                                    </p>
                                    <div class="card border border-secondary my-3">
                                        <div class="card-body py-2">
                                            <p class="my-0">
                                                <b>Note:</b> sending messages longer than Discord message limit WILL
                                                truncate the message. In this case, the allowed amount of characters
                                                will be posted, and the message will contain an embedded file with
                                                original notification content.
                                            </p>
                                        </div>
                                    </div>
                                    <h4>Parameters:</h4>
                                    <ul>
                                        <li><b>discord_id</b>: provide as URI parameter, in body or in query string</li>
                                        <li><b>api_key</b>: provide as URI parameter, special header
                                            <code>X-Api-Key</code>, in body or in query string
                                        </li>
                                        <li><b>message</b>: provide as URI parameter, in body or in query string</li>
                                    </ul>
                                    <h4>Return value</h4>
                                    <p>JSON response is returned. It is an object with <em>status</em> and
                                        <em>message</em> properties. Examples:</p>
                                    <div class="card card-body p-2 mb-3">
                                        <pre class="user-select-all">{"status":"ok","message":"Message succesfully sent"}</pre>
                                        <pre
                                            class="mb-0 user-select-all">{"status":"error","message":"Message must be specified."}</pre>
                                    </div>
                                    <h4>Status codes</h4>
                                    <ul>
                                        <li><code>200</code> : all is good, message was succesfully sent.</li>
                                        <li><code>400</code> : you performed a malformed request. JSON response tells
                                            more.
                                        </li>
                                        <li><code>403</code> : The credentials provided did not match records in
                                            database.
                                        </li>
                                        <li><code>500</code> : General server error. JSON response might tell more.</li>
                                    </ul>
                                    <h4>Javascript example with <code>fetch()</code> :</h4>
                                    <div class="card card-body p-2">
                                        <pre class="mb-0 user-select-all">
fetch('{{ $root.apiRoutes.node }}/api/notify', {
    method: 'POST',
    headers: {
        'X-Api-Key': 'secret_key_1234',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        discord_id: '733574765100663053',
        message: 'Hello World!'
    })
})
    .then(r => r.json())
    .then(console.log);</pre>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-12 mt-3">
                <div class="card border border-danger">
                    <div class="card-header">
                        <h2 class="mb-0">Laravel</h2>
                    </div>
                    <div class="card-body">
                        <p>
                            In this project, Laravel is used for management and configuration. While a user can manage
                            the app simply from the management panel, advanced usage may require a written bot to handle
                            automated key management.
                        </p>
                        <button class="btn btn-danger" type="button" data-toggle="collapse"
                                data-target="#docsCollapseLaravel" aria-expanded="false"
                                aria-controls="docsCollapseLaravel">Show documentation
                        </button>
                        <div class="collapse" id="docsCollapseLaravel">
                            <h4 class="mt-5">Authentication scheme</h4>
                            <p>
                                In Laravel side user authentication is based on Discord OAuth API and persisting same
                                session cookies. This works well on server side, but might prove tricky on Discord API
                                side, especially when initializing the session first time for bot. It might be wise to
                                initialize session in a real browser and sharing the session cookies with the bot.
                            </p>
                            <p>
                                Note that when using OAuth API, you must set your OAuth2 return URL in the <a
                                href="https://discord.com/developers/applications/">Discord Developer panel</a>. The
                                Redirect URL looks like this: <code>{{ $root.apiRoutes.index }}/oauth/return</code> .
                            </p>
                            <ol>
                                <li>
                                    User starts the flow by visiting <code>{{
                                        $root.apiRoutes.index
                                    }}/oauth/start</code> , which
                                    redirects to Discord OAuth login with one-time <em>state</em> parameter.
                                </li>
                                <li>
                                    User authenticates in Discord OAuth API and either gives permission to access their
                                    basic identity information or not.
                                </li>
                                <li>
                                    When authenticated in Discord end and returning back to app via predefined URL, the
                                    one-time <code>state</code> is checked and <code>code</code> parameter (sent by
                                    Discord API) is exchanged automatically to user data in server side. User is now
                                    logged in. Also, a DM channel is now initialized with user.
                                </li>
                            </ol>
                            <h3 class="mt-5">API endpoints</h3>
                            <div class="card border border-secondary">
                                <div class="card-header bg-white">
                                    <p class="my-0"><span class="badge badge-secondary">GET</span></p>
                                    <pre class="mb-0 user-select-all"><span
                                        class="text-secondary">{{ $root.apiRoutes.index }}</span><span
                                        class="text-dark font-weight-bold">/api/user</span></pre>
                                    <pre class="mb-0 user-select-all"><span
                                        class="text-secondary">{{ $root.apiRoutes.index }}</span><span
                                        class="text-dark font-weight-bold">/api/user/&lt;id&gt;</span></pre>
                                </div>
                                <div class="card-body">
                                    <p>
                                        Get current user object. If ID is provided, get user with that ID. Will return
                                        standard Laravel error messages if user has no permission to access that model.
                                    </p>
                                    <h4>Parameters:</h4>
                                    <p><b>ID</b>: optional, provide in URI.</p>
                                    <h4>Return value</h4>
                                    <p>JSON response representing the user is returned if success, JSON error message
                                        otherwise. Examples:</p>
                                    <div class="card card-body p-2 mb-3">
                                        <pre class="user-select-all">{"discord_id":"748445765122129931","username":"Wumpus#1337","avatar_url":"https:\/\/cdn.discordapp.com\/avatars\/748445765122129931\/9db2b73e5c6684a62ef5265a94401b75.png","is_admin":0,"created_at":"2020-07-13T12:34:56.000000Z","updated_at":"2020-08-24T23:34:45.000000Z","keys":[{"id":10,"created_at":"2020-08-14T23:34:45.000000Z","updated_at":"2020-08-15T23:34:45.000000Z","secret":"New key","description":"This is a test key","last_ip_address":"::1","last_used_at":"2020-08-24T23:34:45.000000Z","message_count":12,"user_id":1,"messages":[]}]}</pre>
                                        <pre
                                            class="mb-0 user-select-all">{"message": "This action is unauthorized."}</pre>
                                    </div>
                                    <h4>Status codes</h4>
                                    <ul>
                                        <li><code>200</code> : user object was returned succesfully.</li>
                                        <li><code>403</code> : user is unauthorized to get this information.</li>
                                        <li><code>500</code> : general server error.</li>
                                    </ul>
                                    <h4>Javascript example with <code>fetch()</code> :</h4>
                                    <div class="card card-body p-2">
                                        <pre class="mb-0 user-select-all">
// Note that "credentials": "include" sends session cookies alongside request.
fetch("http://localhost/api/user", {
    "credentials": "include",
    "headers": {
        "Accept": "application/json",
    },
    "method": "GET",
})
    .then(r => r.json())
    .then(console.log);</pre>
                                    </div>
                                </div>
                            </div>
                            <div class="card border border-secondary mt-3">
                                <div class="card-header bg-white">
                                    <p class="my-0"><span class="badge badge-primary">POST</span></p>
                                    <pre class="mb-0 user-select-all"><span
                                        class="text-secondary">{{ $root.apiRoutes.index }}</span><span
                                        class="text-dark font-weight-bold">/api/key</span></pre>
                                </div>
                                <div class="card-body">
                                    <p>
                                        Create a new key for user.
                                    </p>
                                    <h4>Parameters:</h4>
                                    <p><b>discord_id</b>: required, in JSON body. The Discord ID must exist in database.
                                    </p>
                                    <p><b>secret</b>: required, in JSON body. Must be unique for user, different users
                                        are able to have same secret.</p>
                                    <p><b>description</b>: required, in JSON body.</p>
                                    <h4>Return value</h4>
                                    <p>Static JSON response is returned if success, JSON error message with validation
                                        errors otherwise. Examples:</p>
                                    <div class="card card-body p-2 mb-3">
                                        <pre class="user-select-all">{"status":"ok"}</pre>
                                        <pre class="mb-0 user-select-all">{"status":"error","data":{"secret":["The secret must be unique for user."],"description":["The description field is required."]}}</pre>
                                    </div>
                                    <h4>Status codes</h4>
                                    <ul>
                                        <li><code>200</code> : key was created succesfully.</li>
                                        <li><code>400</code> : request violated validation rules, no key was created.
                                        </li>
                                        <li><code>419</code> : CSRF token mismatch, no key was created.</li>
                                        <li><code>500</code> : general server error.</li>
                                    </ul>
                                    <h4>Javascript example with <code>fetch()</code> :</h4>
                                    <div class="card card-body p-2">
                                        <pre class="mb-0 user-select-all">
// Note that "credentials": "include" sends session cookies alongside request.
fetch("http://localhost/api/key", {
    "credentials": "include",
    "headers": {
        "Accept": "application/json",
        "content-type": "application/json",
        "x-csrf-token": "MDNiMmNlNDllNGE1NDEwNjhkNDk1YWI1NzBmYzJi",
    },
    "body": "{\"secret\":\"New key\",\"description\":\"This is a new key\",\"discord_id\":\"748445765122129931\"}",
    "method": "POST",
});
    .then(r => r.json())
    .then(console.log);</pre>
                                    </div>
                                </div>
                            </div>
                            <div class="card border border-secondary mt-3">
                                <div class="card-header bg-white">
                                    <p class="my-0"><span class="badge badge-danger">DELETE</span></p>
                                    <pre class="mb-0 user-select-all"><span
                                        class="text-secondary">{{ $root.apiRoutes.index }}</span><span
                                        class="text-dark font-weight-bold">/api/key/&lt;id&gt;</span></pre>
                                </div>
                                <div class="card-body">
                                    <p>
                                        Delete existing key for user.
                                    </p>
                                    <h4>Parameters:</h4>
                                    <p><b>ID</b>: required, provide in URI.</p>
                                    <h4>Return value</h4>
                                    <p>Static JSON response is returned if success, JSON error message otherwise.
                                        Examples:</p>
                                    <div class="card card-body p-2 mb-3">
                                        <pre class="user-select-all">{"status":"ok"}</pre>
                                        <pre
                                            class="mb-0 user-select-all">{"message": "This action is unauthorized."}</pre>
                                    </div>
                                    <h4>Status codes</h4>
                                    <ul>
                                        <li><code>200</code> : user object was returned succesfully.</li>
                                        <li><code>403</code> : user is unauthorized to do this deletion.</li>
                                        <li><code>500</code> : general server error.</li>
                                    </ul>
                                    <h4>Javascript example with <code>fetch()</code> :</h4>
                                    <div class="card card-body p-2">
                                        <pre class="mb-0 user-select-all">
// Note that "credentials": "include" sends session cookies alongside request.
await fetch("http://localhost/api/key/123", {
    "credentials": "include",
    "headers": {
        "Accept": "application/json",
        "x-csrf-token": "MDNiMmNlNDllNGE1NDEwNjhkNDk1YWI1NzBmYzJi",
    },
    "method": "DELETE",
})
    .then(r => r.json())
    .then(console.log);</pre>
                                    </div>
                                </div>
                            </div>
                            <div class="card border border-secondary mt-3">
                                <div class="card-header bg-white">
                                    <p class="my-0"><span class="badge badge-danger">DELETE</span></p>
                                    <pre class="mb-0 user-select-all"><span
                                        class="text-secondary">{{ $root.apiRoutes.index }}</span><span
                                        class="text-dark font-weight-bold">/api/message/&lt;id&gt;</span></pre>
                                </div>
                                <div class="card-body">
                                    <p>
                                        Delete existing message for user. These messages are only saved in database if
                                        they couldn't be delivered to user.
                                    </p>
                                    <h4>Parameters:</h4>
                                    <p><b>ID</b>: required, provide in URI.</p>
                                    <h4>Return value</h4>
                                    <p>Static JSON response is returned if success, JSON error message otherwise.
                                        Examples:</p>
                                    <div class="card card-body p-2 mb-3">
                                        <pre class="user-select-all">{"status":"ok"}</pre>
                                        <pre
                                            class="mb-0 user-select-all">{"message": "This action is unauthorized."}</pre>
                                    </div>
                                    <h4>Status codes</h4>
                                    <ul>
                                        <li><code>200</code> : user object was returned succesfully.</li>
                                        <li><code>403</code> : user is unauthorized to do this deletion.</li>
                                        <li><code>500</code> : general server error.</li>
                                    </ul>
                                    <h4>Javascript example with <code>fetch()</code> :</h4>
                                    <div class="card card-body p-2">
                                        <pre class="mb-0 user-select-all">
// Note that "credentials": "include" sends session cookies alongside request.
await fetch("http://localhost/message/key/123", {
    "credentials": "include",
    "headers": {
        "Accept": "application/json",
        "x-csrf-token": "MDNiMmNlNDllNGE1NDEwNjhkNDk1YWI1NzBmYzJi",
    },
    "method": "DELETE",
})
    .then(r => r.json())
    .then(console.log);</pre>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-12 mt-3">
                <Hierarchy></Hierarchy>
            </div>
        </div>
    </div>
</template>
<script>
import Hierarchy from "./partials/Hierarchy";

export default {
    components: {Hierarchy}
}
</script>
