<template>
    <div>
        <div class="container-fluid hero bg-dark text-center text-white position-relative">
            <div class="row">
                <div class="col-12 my-5 py-5">
                    <h1 class="display-1 mb-5 text-shadow">Dewny</h1>
                    <p class="h4 mb-5 text-shadow">Get push notifications from logging apps straight to your DMs</p>
                    <router-link class="btn btn-primary btn-lg mb-5" to="/user">Create your first API key!</router-link>
                    <p class="h5 text-shadow">
                        <a href="https://github.com/Hegezcc/dewny/"><i class="fab fa-github"></i> Github</a>
                        &middot;
                        <router-link to="/docs">Installation</router-link>
                    </p>
                </div>
            </div>
        </div>
        <div class="container mt-3 mb-5">
            <div class="row">
                <div class="col offset-sm-3">
                    <h2 class="mt-5 mb-4">How it works</h2>
                </div>
            </div>
            <div class="row position-relative">
                <div class="background-element"></div>
                <div class="col">
                    <Panel i="1" color="danger" :img="$root.apiRoutes.index + '/images/oauth.jpg'">
                        <h5>Register via Discord auth</h5>
                        <p class="mb-0">
                            Clicking "<a :href="$root.apiRoutes['oauth.start']">Log in</a>" will redirect to Discord
                            OAuth service, where you can authorize this app with your details. Lots of magic will happen
                            after that, but after some private discussion between our and Discord's servers you'll see
                            your lovely profile picture in the user panel.
                        </p>
                    </Panel>
                    <Panel i="2" color="warning" :img="$root.apiRoutes.index + '/images/key.jpg'">
                        <h5>Create API key</h5>
                        <p class="mb-0">
                            Going into
                            <router-link to="/user">user panel</router-link>
                            and clicking "Create new key" button will allow you to define an API
                            key and test it with "Test API" box. Want your messages into specific guild channel instead
                            of your DM box? No problem, just invite the bot into desired server, change Developer mode
                            on in your Discord client, "Copy ID" of the text channel and paste it to the "Channel ID"
                            field. Bot will ensure it sends the message specifically there, provided you don't ban it.
                        </p>
                    </Panel>
                    <Panel i="3" color="success" :img="$root.apiRoutes.index + '/images/service.jpg'">
                        <h5>Configure your service</h5>
                        <p class="mb-0">
                            Clicking the "Fire!" button is all fun and games, but even a service like this is built for
                            serious tasks like notifying you when something did not go as expected. Either copy the
                            specifically-crafted URL from the tester, or dive into the
                            <router-link to="/docs">documentation</router-link>
                            to learn more about how the bot actually works and can be used. The Node.js server is quite
                            liberal about what kind of input it accepts, and you can even fool most loggers by providing
                            your secret key via custom <code>X-Api-Key</code> header, if required. For most purposes,
                            just concatenating your message after your Discord ID and secret key will do, though.
                        </p>
                    </Panel>
                </div>
            </div>
            <div class="row justify-content-center mt-5">
                <div class="col-8 col-sm-6 col-lg-4">
                    <div class="card text-white bg-primary text-center">
                        <div class="card-header">
                            <h3 class="font-italic mb-0">Still thinking?</h3>
                        </div>
                        <div class="card-body">
                            <p class="mb-0">
                                <router-link class="btn btn-success mr-1" to="/user">Click here</router-link> to get started!
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Panel from './partials/Panel';

export default {
    components: { Panel },
    data() {
        return {
        }
    }
}
</script>
<style scoped lang="scss">
.hero::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    background-image: url(/images/background.jpg);
    background-size: cover;
    background-attachment: fixed;
    background-position: center;

    filter: blur(1px) grayscale(50%) brightness(30%);
}

.background-element {
    position: absolute;
    top: 5rem;
    left: calc((-100vw + 100%) / 4);
    width: calc(100% + ((100vw - 100%) / 2));
    height: calc(100% - 10rem);
    background: var(--secondary);
    transform: skewX(-20deg);
    opacity: 0.2;
}
</style>
