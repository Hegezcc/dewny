<template>
    <div class="card container mt-3">
        <div class="row">
            <div class="v-image card-header col-12 col-sm-3 rounded text-shadow d-flex p-3" :style="{ backgroundImage: `url(${img})` }">
                <p class="v-pill text-white shadow" :class="[ 'bg-' + color ]">{{ i }}</p>
            </div>
            <div class="card-body col-12 col-sm-9">
                <slot></slot>
            </div>
        </div>

    </div>
</template>
<script>
export default {
    props: ['img', 'i', 'color'],
    data() {
        return {}
    },
    mounted() {
    },
    computed: {
        imageStyle() {
            return {
                backgroundImage: this.img
            }
        }
    }
}
</script>
<style scoped>
.card-header {
    background-position: center;
    background-size: cover;
}
.v-pill {
    display: block;
    width: 3em;
    height: 3em;
    margin: auto;
    padding: 1em;
    font-size: 1.5rem;
    font-weight: 600;
    text-align: center;
    line-height: 1;
    border-radius: 50%;
}

.v-image {
    box-shadow: inset 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

</style>
