<template>
    <ul class="menus">
        <li v-for="item in props.menus">
            <a :href="`#${item.id}`">#{{item.title}}</a>
            <ul v-if="item[props.childLabel]&& item[props.childLabel].length" class="child">
                <menu-tree :menus="item[props.childLabel]" :child-label="props.childLabel"></menu-tree>
            </ul>
        </li>
    </ul>
</template>

<script setup lang="ts">
const props = defineProps({
    menus: {
        type: [Object, Array],
        required: true
    },
    childLabel: {
        type: String,
        default: 'child'
    }
})
</script>

<style scoped lang="scss">
.menus {
    line-height: 1.7em;
}

.child {
    padding-left: 15px;
}
</style>
