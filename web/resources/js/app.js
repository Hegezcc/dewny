/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');


window.Vue = require('vue');

import VueRouter from 'vue-router';
Vue.use(VueRouter);

import VueAxios from 'vue-axios';
import axios from 'axios';
Vue.use(VueAxios, axios);

/**
 * The following block of code may be used to automatically register your
 * Vue components. It will recursively scan this directory for the Vue
 * components and automatically register them with their "basename".
 *
 * Eg. ./components/ExampleComponent.vue -> <example-component></example-component>
 */

//const files = require.context('./', true, /\.vue$/i)
//files.keys().map(key => Vue.component(key.split('/').pop().split('.')[0], files(key).default))

//Vue.component('example-component', require('./components/App.vue').default);

/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

// First some log catcher stuff
const oldLogs = {
    log: window.console.log,
    error: window.console.error,
    warn: window.console.warn,
}

window.console.log = (...data) => {logger(data, 'LOG'); oldLogs.log(...data)};
window.console.error = (...data) => {logger(data, 'ERR'); oldLogs.error(...data)};
window.console.warn = (...data) => {logger(data, 'WARN'); oldLogs.warn(...data)};

window.consoleData = [];

function logger(data, level) {
    window.consoleData.push(`[${level}] ${data.toString()}`);
}

import App from './components/App.vue';
import Home from './components/Home.vue';
import User from './components/User.vue';
import Docs from './components/Docs.vue';
import ErrorComponent from './components/Error.vue';
import FourOhFour from './components/FourOhFour.vue';

const router = new VueRouter({
    mode: 'history',
    routes: [
        {
            name: 'Home',
            path: '/',
            component: Home,
        },
        {
            name: 'User',
            path: '/user',
            component: User,
        },
        {
            name: 'Docs',
            path: '/docs',
            component: Docs,
        },
        {
            name: 'Error',
            path: '/error',
            component: ErrorComponent,
        },
        {
            name: '404',
            path: '*',
            component: FourOhFour,
        },
    ],
});

const app = new Vue({
    el: '#app',
    components: { App },
    data: {
        user: null,
        apiRoutes: {},
        errors: [],
        loggerEnabled: false,
        csrfToken: null,
        botClientId: null,
        hierarchyMap: null,
    },
    created() {
        this.errors = window.errors;
        this.user = window.data.user;
        this.apiRoutes = window.data.routes;
        this.csrfToken = document.head.querySelector("[name~=csrf-token][content]").content;
        this.botClientId = window.data.bot_client_id;
        this.loggerEnabled = window.data.debug;
    },
    methods: {
        async fetchUser() {
            this.user = await fetch(this.apiRoutes['user.get'], {
                method: 'GET',
                headers: {
                    'accept': 'application/json'
                }
            }).then(r => r.json());
        }
    },
    router,
});

window.app = app;
