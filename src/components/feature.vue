<template>
    <div class="feature">
        <router-link :to="`/article/${props.data.id}`">
            <div class="feature-title"><span class="foverlay">{{props.data.title}}</span></div>
            <img :src="props.data.img">
        </router-link>
    </div>
</template>

<script setup lang="ts">
const props = defineProps({
    data: {
        type: Object,
        default: () => {
            return {
                title: 'Akina',
                img: 'https://cdn.zhebk.cn/usr/themes/Akina//images/feature/feature1.jpg',
                href: 'https://zhebk.cn/Web/Akina.html'
            }
        }
    }
})

</script>

<style scoped lang="scss">
.feature {
    width: inherit;
    position: relative;

    img {
        height: 160px;
        width: 257px;
        object-fit: cover;
        border-radius: 5px;
    }

    & a:hover .foverlay {
        opacity: 1;
    }

    .foverlay {
        position: absolute;
        z-index: 2;
        width: 257px;
        height: 160px;
        text-align: center;
        line-height: 160px;
        background: #BBE2DB;
        color: white;
        font-size: 16px;
        opacity: 0;
        border-radius: 5px;

        -moz-transition: opacity .4s ease-out;
        -o-transition: opacity .4s ease-out;
        -webkit-transition: opacity .4s ease-out;
        transition: opacity .4s ease-out;
    }
}
</style>