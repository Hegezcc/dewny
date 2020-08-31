<template>
    <nav class="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
        <div class="container">
            <router-link class="navbar-brand" to="/">
                <img :src="$root.apiRoutes.index + '/images/logo.svg'" width="30" height="30" alt="Dewny">
            </router-link>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarCollapse">
                <ul class="navbar-nav mr-auto">
                    <template v-for="(show, uri) in links">
                        <router-link v-if="show" :to="uri" v-slot="{ href, route, navigate, isActive, isExactActive }">
                            <li class="nav-item" :key="uri" :class="{active: isExactActive}">
                                <a class="nav-link" :href="href" @click="navigate">{{ route.name }} <span v-if="isExactActive" class="sr-only">(current)</span></a>
                            </li>
                        </router-link>
                    </template>
                </ul>
                <a :href="loginUrl" class="btn my-2 my-sm-0" :class="[ loggedIn ? 'btn-outline-primary text-white' : 'btn-primary' ]">
                    <span v-if="loggedIn"><i class="fa fa-sign-out-alt"></i> Log out</span>
                    <span v-else><i class="fa fa-sign-in-alt"></i> Log in</span>
                </a>
            </div>
        </div>
    </nav>
</template>
<script>
    export default {
        data() {return {
        }},
        mounted() {
        },
        computed: {
            loggedIn() {
                return this.$root.user !== null;
            },
            loginUrl() {
                if (this.loggedIn) {
                    return this.$root.apiRoutes['logout'];
                } else {
                    return this.$root.apiRoutes['oauth.start'];
                }
            },
            links() {
                return {
                    '/': true,
                    '/user': this.loggedIn,
                    '/docs': true,
                };
            }
        }
    }
</script>
