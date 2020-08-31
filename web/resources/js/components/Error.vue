<template>
    <div class="container py-3">
        <div class="row justify-content-center">
            <div class="col col-lg-4 col-md-6 col-sm-8">
                <div class="card text-white bg-danger">
                    <div class="card-body">
                        <h2 class="card-title">Oh snap!</h2>
                        <p class="card-subtitle">An{{ errors.length === 0 ? ' unknown' : '' }} error occurred.</p>
                        <hr>
                        <p class="card-text" v-for="err of errors">{{ err }}</p>
                        <router-link to="/" v-slot="{ href, navigate }">
                            <a :href="href" type="button" class="btn btn-light text-right mt-2" @click="navigate">
                                Back to home
                            </a>
                        </router-link>
                    </div>
                    <div class="card-footer">
                        <small>Seeing this much? Report issue at <a href="https://github.com/Hegezcc/dewny/issues">Github</a></small>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            errors: [],
        }
    },
    created() {
        this.errors = this.$root.errors;
    }
}
</script>
