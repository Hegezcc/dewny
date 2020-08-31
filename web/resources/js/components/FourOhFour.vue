<template>
    <div class="container py-3">
        <div class="row justify-content-center">
            <div class="col col-lg-8">
                <div class="card text-white text-center bg-secondary">
                    <div class="card-body">
                        <h1 class="card-title">404</h1>
                        <p class="card-subtitle">Page not found.</p>
                        <hr>
                        <router-link to="/" v-slot="{ href, navigate }">
                            <a :href="href" type="button" class="btn btn-light text-right mt-2" @click="navigate">Back to home</a>
                        </router-link>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
    }
</script>
<style scoped>
    h1 {
        font-size: 10em;
    }
    p {
        font-size: 1.5em;
    }
</style>
