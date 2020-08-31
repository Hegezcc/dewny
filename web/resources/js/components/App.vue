<template>
    <div id="body-container" class="d-flex flex-column">
        <Nav></Nav>
        <main>
            <router-view></router-view>
            <div class="container my-3">
                <div class="row">
                    <Log v-if="$root.loggerEnabled"></Log>
                </div>
            </div>
        </main>
        <Footer class="mt-auto"></Footer>
    </div>
</template>

<script>
    import Nav from './Nav.vue';
    import Log from './Log.vue';
    import Footer from "./Footer";
    export default {
        components: { Nav, Log, Footer },
        mounted() {
        }
    }
</script>
<style scoped>
#body-container {
    min-height: calc(100vh - 3.44rem);
}
</style>
