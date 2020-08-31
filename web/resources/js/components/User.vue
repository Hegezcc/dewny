<template>
    <div class="container py-3">
        <template v-if="$root.user !== null">
            <div class="row justify-content-center">
                <div class="col col-md-4 col-12 mb-md-0 mb-3">
                    <div class="card text-white bg-dark">
                        <div class="card-body">
                            <figure class="text-center">
                                <img class="rounded-circle" :src="$root.user.avatar_url" :alt="$root.user.username">
                            </figure>
                            <h1 class="card-title">{{ $root.user.username }}</h1>
                            <hr>
                            <ul class="list-unstyled">
                                <li>{{ $root.user.keys.length }} API key{{
                                        $root.user.keys.length === 1 ? '' : 's'
                                    }}
                                </li>
                                <li>{{ $root.user.is_admin ? 'Administrator' : 'Normal user' }}</li>
                                <li>Account created on {{ $root.user.created_at | date }}</li>
                            </ul>
                            <a :href="authenticationUrl" class="btn btn-light" target="_blank">Invite bot to server</a>
                        </div>
                    </div>
                </div>
                <div class="col col-md-8 col-12">
                    <div class="card border border-danger">
                        <div class="card-body">
                            <h2 class="card-subtitle text-secondary mb-2">Undelivered messages</h2>
                            <p v-if="undelivered === 0">You have no undelivered messages.</p>
                            <template v-else>
                                <p><b>You have </b><span class="badge badge-danger">{{ undelivered }}</span><b>
                                    undelivered messages
                                    waiting!</b></p>
                                <button role="button" class="btn btn-danger mb-3" @click="showMessages = !showMessages">
                                    {{ showMessages ? 'Hide' : 'Show' }} messages
                                </button>
                                <div v-if="showMessages" class="table-responsive">
                                    <table class="table">
                                        <thead class="thead-light">
                                        <tr>
                                            <th scope="col">Secret</th>
                                            <th scope="col">Data</th>
                                            <th scope="col">Sent</th>
                                            <th scope="col">Delete</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        <template v-for="key of $root.user.keys">
                                            <tr v-for="msg of key.messages" :key="msg.id">
                                                <th scope="row">{{ key.secret }}</th>
                                                <td>{{ msg.data }}</td>
                                                <td>{{ msg.created_at | date }}</td>
                                                <td>
                                                    <button class="btn btn-outline-danger"
                                                            @click="removeMessage(msg.id)">
                                                        &times;
                                                    </button>
                                                </td>
                                            </tr>
                                        </template>
                                        </tbody>
                                    </table>

                                </div>
                            </template>
                            <p class="text-small text-secondary mb-1">
                            <span data-toggle="tooltip" data-placement="right"
                                  title="Sometimes Discord API service is down, thus we cannot guarantee timely delivery of sent messages. If that happens, we save your message into our database for later delivery.">What's this?</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col col-12 mt-3">
                    <div class="card border border-primary">
                        <div class="card-body">
                            <h2 class="card-subtitle text-secondary mb-3">Keys</h2>
                            <div class="table-responsive" v-if="$root.user.keys.length !== 0">
                                <table class="table">
                                    <thead class="thead-light">
                                    <tr>
                                        <th scope="col">Secret</th>
                                        <th scope="col">Description</th>
                                        <th scope="col">Channel ID</th>
                                        <th scope="col">Sent</th>
                                        <th scope="col">Undelivered</th>
                                        <th scope="col">Created</th>
                                        <th scope="col">Last used</th>
                                        <th scope="col">Last IP address</th>
                                        <th scope="col">Delete</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr v-for="key of $root.user.keys" :key="key.id">
                                        <th scope="row">{{ key.secret }}</th>
                                        <td>{{ key.description }}</td>
                                        <td>{{ key.channel_id }}</td>
                                        <td>{{ key.message_count }}</td>
                                        <td>{{ key.messages.length }}</td>
                                        <td>{{ key.created_at | date }}</td>
                                        <td>{{ key.last_used_at | date }}</td>
                                        <td>{{ key.last_ip_address }}</td>
                                        <td>
                                            <button class="btn btn-outline-danger" @click="removeKey(key.id)">&times;
                                            </button>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                            <p v-else>You have no keys yet.</p>
                            <button role="button" class="btn btn-primary text-white mt-2" @click="createNewKey"
                                    v-if="newKeyState === 'none'">Create new key
                            </button>
                            <form class="form-inline mt-2" @submit.prevent="postNewKey"
                                  v-else-if="newKeyState === 'form'">
                                <label class="sr-only" for="formKeyName">Secret (required)</label>
                                <input type="text" class="form-control mb-2 mb-sm-0 mr-sm-2" id="formKeyName"
                                       placeholder="Secret *" v-model="newKeySecret">

                                <label class="sr-only" for="formKeyDescription">Description (optional)</label>
                                <input type="text" class="form-control mb-2 mb-sm-0 mr-sm-2" id="formKeyDescription"
                                       placeholder="Description (optional)" v-model="newKeyDescription">

                                <div class="input-group mb-2 mb-sm-0 mr-sm-2">
                                    <label class="sr-only" for="formKeyChannelId">Channel ID (optional)</label>
                                    <input type="number" class="form-control" id="formKeyChannelId"
                                           placeholder="Channel ID (optional)" v-model="newKeyChannelId">

                                    <div class="input-group-append">
                                        <div class="input-group-text">
                                            <span data-toggle="tooltip" data-placement="top"
                                                  title="Channel ID is 15-20 digit long integer. You can copy it in Discord app by turning on Developer mode, right-clicking channel and selecting &quot;Copy ID&quot;.">?</span>
                                        </div>
                                    </div>
                                </div>

                                <button type="submit" class="btn btn-primary mb-2 mb-sm-0">Submit</button>
                            </form>
                            <div class="card border border-primary text-primary mt-2"
                                 v-else-if="newKeyState === 'creating'">
                                <div class="card-body">
                                    <p class="my-0">Creating key...</p>
                                </div>
                            </div>
                            <div class="card border border-success text-success mt-2"
                                 v-else-if="newKeyState === 'created'">
                                <div class="card-body">
                                    <p class="my-0">New key created!</p>
                                </div>
                            </div>
                            <div class="card border border-danger text-danger mt-2" v-else-if="newKeyState === 'error'">
                                <div class="card-body">
                                    <p>{{ errorWording }} occurred:</p>
                                    <ul v-if="newKeyError" class="list-unstyled">
                                        <li v-for="(err, i) of newKeyError" :key="i">{{ err }}</li>
                                    </ul>
                                    <button type="button" class="btn btn-danger" @click="resetNewKey(false)">Reset
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row" v-if="$root.user.keys.length !== 0">
                <div class="col col-12 mt-3">
                    <div class="card border border-success">
                        <div class="card-body">
                            <h2 class="card-subtitle text-secondary mb-3">Test API</h2>
                            <form @submit.prevent="fireApi">
                                <div class="form-group row">
                                    <label for="formApiMessage" class="col-sm-2 col-form-label">Message</label>
                                    <div class="col-sm-10">
                                        <input type="text" class="form-control" id="formApiMessage"
                                               placeholder="Enter message" v-model="message">
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label for="formApiKey" class="col-sm-2">API key</label>
                                    <div class="col-sm-10">
                                        <select class="form-control" id="formApiKey" v-model="selectedKey">
                                            <option v-for="key of $root.user.keys">{{ key.secret }}</option>
                                        </select>
                                    </div>
                                </div>
                                <button type="submit" class="btn btn-success">Fire!</button>
                            </form>
                            <div class="card border border-danger text-danger mt-2" v-if="fireError">
                                <div class="card-body">
                                    <p class="my-0">An error occurred: {{ fireError }}</p>
                                </div>
                            </div>
                            <p v-if="exampleUrl" class="mt-3">
                                You can also post the message with this URL:<br>
                                <code><a :href="exampleUrl" target="_blank">{{ exampleUrl }}</a></code>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>
<script>
export default {
    data() {
        return {
            showMessages: false,
            selectedKey: null,
            message: null,
            fireError: null,
            newKeyState: 'none',
            newKeyError: null,
            newKeySecret: null,
            newKeyChannelId: null,
            newKeyDescription: null,
        }
    },
    created() {
        if (this.$root.user !== null) {
            if (this.$root.user.keys.length !== 0) {
                this.selectedKey = this.$root.user.keys[0].secret;
            }
        }
    },
    mounted() {
        $(this.$el).find('[data-toggle="tooltip"]').tooltip();
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            if (vm.$root.user === null) {
                window.location = vm.$root.apiRoutes['oauth.start'];
            }
        });
    },
    methods: {
        createNewKey() {
            this.newKeyState = 'form';

            setTimeout(() => $(this.$el).find('[data-toggle="tooltip"]').tooltip(), 0);
        },
        async postNewKey() {
            this.newKeyState = 'creating';

            const res = await fetch(this.$root.apiRoutes['key.new'], {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    'content-type': 'application/json',
                    'accept': 'application/json',
                    'x-csrf-token': this.$root.csrfToken,
                },
                body: JSON.stringify({
                    secret: this.newKeySecret,
                    description: this.newKeyDescription,
                    channel_id: this.newKeyChannelId,
                    discord_id: this.$root.user.discord_id,
                })
            });

            if (res.ok) {
                this.newKeyState = 'created';
                setTimeout(() => this.resetNewKey(true), 2000);
            } else {
                this.newKeyState = 'error';
                if (res.status === 400) {
                    // Flatten server-provided error bag to array of validation errors
                    this.newKeyError = Object.values((await res.json()).data).reduce((a, b) => a.concat(b), []);
                }
            }

            this.$root.fetchUser();
        },
        encodeURI(str) {
            if (str === null || str.length === 0) return null;

            const reserved = new Set("!*'();:@&=+$,/?#[]");
            let newStr = '';

            for (let char of str) {
                if (reserved.has(char)) {
                    // Percent-encode
                    newStr += '%' + char.charCodeAt(0).toString(16).toUpperCase();
                } else {
                    newStr += char;
                }
            }

            return newStr;
        },
        resetNewKey(resetForm) {
            if (resetForm) {
                this.newKeySecret = null;
                this.newKeyDescription = null;
                this.newKeyError = null;
                this.newKeyState = 'none';
            } else {
                this.newKeyState = 'form';
            }
        },
        async removeKey(id) {
            await fetch(this.$root.apiRoutes['key.delete'].replace('{id}', id), {
                method: 'DELETE',
                credentials: 'same-origin',
                headers: {
                    'accept': 'application/json',
                    'x-csrf-token': this.$root.csrfToken,
                }
            });

            this.$root.fetchUser();
        },
        async removeMessage(id) {
            await fetch(this.$root.apiRoutes['message.delete'].replace('{id}', id), {
                method: 'DELETE',
                credentials: 'same-origin',
                headers: {
                    'accept': 'application/json',
                    'x-csrf-token': this.$root.csrfToken,
                }
            });

            this.$root.fetchUser();
        },
        async fireApi() {
            const res = await fetch(`${this.$root.apiRoutes.node}/api/notify`, {
                method: 'POST',
                headers: {
                    'x-api-key': this.selectedKey,
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    discord_id: this.$root.user.discord_id,
                    message: this.message,
                })
            }).then(r => r.json());

            if (res.status === 'error') {
                this.fireError = res.message;
            } else {
                this.fireError = null;
            }

            this.$root.fetchUser();
        }
    },
    computed: {
        undelivered() {
            if (this.$root.user.keys.length === 0) return 0;

            return this.$root.user.keys.map(x => x.messages.length).reduce((a, b) => a + b);
        },
        authenticationUrl() {
            return `https://discord.com/oauth2/authorize?client_id=${this.$root.botClientId}&scope=bot`;
        },
        errorWording() {
            // newKeyError may be string or array of errors
            if ((!(this.newKeyError instanceof Array)) || (this.newKeyError.length === 1)) {
                return 'An error';
            } else {
                return 'Errors'
            }
        },
        exampleUrl() {
            if (this.selectedKey === null) {
                return null;
            }

            const key = this.encodeURI(this.selectedKey);
            const message = this.encodeURI(this.message);

            if (key === null || message === null) return null;

            return `${this.$root.apiRoutes.node}/api/notify/${this.$root.user.discord_id}/${key}/${message}`;
        }
    },
    filters: {
        date(val) {
            if (val) {
                return new Date(val).toLocaleString();
            } else {
                return null;
            }
        }
    }
}
</script>
<style scoped>
td .btn-outline-danger {
    font-size: 1.5em;
    line-height: 1.2;
}
</style>
