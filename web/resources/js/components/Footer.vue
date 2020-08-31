<template>
    <footer class="text-center bg-dark py-3 text-white">
        <div class="container">
            <ul class="d-flex list-unstyled flex-row flex-wrap text-nowrap justify-content-center m-0">
                <li><a href="https://github.com/Hegezcc/dewny/blob/master/LICENSE">&copy;</a> Heikki Miinalainen 2020</li>
                <li>more excellence at <a href="https://hgz.fi/">hgz.fi</a></li>
                <li><router-link to="/privacy">Privacy policy</router-link></li>
                <li><a href="https://github.com/Hegezcc/dewny/issues">Found a <i class="fa fa-bug"></i>?</a></li>
            </ul>
        </div>
    </footer>
</template>
<script>
export default {
    data() {return {

    }}
}
</script>
<style scoped lang="scss">
li::before {
    content: "\2013";
    margin: 0 0.5rem;
}
li:first-child::before {
    content: "";
}
a {
    color: inherit;
    font-weight: 600;

    &:hover {
        text-decoration: underline;
    }
}
</style>
