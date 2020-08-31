<template>
    <div class="container">
        <div class="row">
            <div class="col-12 mt-5">
                <button class="btn" :class="btnClass" type="button" data-toggle="collapse"
                        data-target="#logsCollapse" aria-expanded="false"
                        aria-controls="logsCollapse">
                    <i class="fa fa-bug"></i>
                    Debug
                </button>
                <div class="collapse" id="logsCollapse">
                    <div class="card border border-danger mb-1 mt-3">
                        <div class="card-header">
                            <span>Browser console</span>
                        </div>
                        <div class="card-body">
                            <button class="btn btn-secondary mb-0" role="button" @click="updateErrors">Update</button>
                            <ul class="list-unstyled mt-3 mb-0 text-danger" v-if="errors.length !== 0">
                                <li v-for="(err, i) of errors" :key="i">{{ err }}</li>
                            </ul>
                        </div>
                    </div>
                    <div class="card border border-dark">
                        <div class="card-header">
                            <span>User data</span>
                        </div>
                        <div class="card-body">
                            <pre class="mb-0">{{ JSON.stringify($root.user, null, 2) }}</pre>
                        </div>
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
    mounted() {
        this.updateErrors();
    },
    methods: {
        updateErrors() {
            this.errors = window.consoleData;
        }
    },
    computed: {
        btnClass() {
            // We want
            if (this.errors.length !== 0) {
                return ['btn-danger'];
            } else {
                return ['btn-outline-danger'];
            }
        }
    }
}
</script>
