# Dewny

RESTful API and management panel for sending automated messages to Discord channels

Get push notifications from logging apps straight to your Discord DMs!
Includes key management, custom channels, multiple users and even saving
messages to database and sending them later, should Discord API be down.

This project is divided to two main modules: Laravel and Node.js apps. Both should be configured, but with a bit of 
hacking, Node.js app can be ran standalone, and Laravel app can serve as a backend for existing Node.js service. 
In most cases you should still run both services, unless you know what you're doing.  

Live demo: [dewny.hgz.fi](https://dewny.hgz.fi/)

## Installation

Prerequisites:

 * Discord client and account
 * Node.js, npm and nvm on your system
 * Sequelize-compatible database configured, e.g. MySQL, PostgreSQL or SQLite
 * [Discord application and bot user](https://discord.com/developers/applications)
 * Project cloned to your server of choice
 
**Note:** service relies heavily on 64-bit Twitter snowflakes as identifiers. In Discord, you should go to Settings > 
Appearance > Advanced and toggle Developer mode on. It allows you to right-click and Copy ID those useful identifiers. 

## Configuration

### Node

 * Use command line to navigate to `node/` folder in the project and run `nvm use` and `npm install` . 
   You should also install your preferred database driver, e.g. with `npm install mysql2` . 
   [More info](https://sequelize.org/v5/manual/getting-started.html)
 * Copy `node/config/auth.example.json` to `node/config/auth.json` and configure it to match your credentials. 
 * Copy `node/config/config.example.mjs` to `node/config/config.mjs` and configure it to match your setup. 
 * Test the app by running `npm run start` . If no errors show up, you are good to continue.

**Note:** during first run test Sequelize may say that tables do not exist. This is normal, as they will be created 
later on during Laravel configuration.

**Note #2:** you might want to daemonize the Node.js app to run as a service, so it is always running at background. 
Depending on your system, you may use either your OS services (e.g. 
[Systemd](https://nodesource.com/blog/running-your-node-js-app-with-systemd-part-1/), 
[node-windows](http://bestirtech.com/blog/2019/02/node-windows-service-node-js-app/)), 
[PM2](https://pm2.keymetrics.io/docs/usage/quick-start/) or for quick testing, 
[screen](https://stackoverflow.com/questions/26245942/how-do-i-leave-node-js-server-on-ec2-running-forever) / 
[tmux](https://www.howtogeek.com/671422/how-to-use-tmux-on-linux-and-why-its-better-than-screen/). 
[This page](https://stackoverflow.com/questions/4018154/how-do-i-run-a-node-js-app-as-a-background-service) 
has more info about possible solutions. 

### Laravel
    
 * Configure your web server to satisfy [requirements](https://laravel.com/docs/7.x#server-requirements) for running Laravel.
 * Point your web directory to `web/public/` .
 * Copy `web/.env.example` to `web/.env` and set your database & Discord application credentials on that file.
 * On command line, navigate to `web/` and run the following commands:
   * `composer install`
   * `npm install`
   * `php artisan key:generate`
   * `php artisan migrate`
 * If no errors occurred, you should now be able to navigate to the app in web browser.