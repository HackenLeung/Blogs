<template>
    <div id="layout-body">
        <router-view></router-view>
        <back-top></back-top>
    </div>
</template>

<script setup lang="ts">
   const minHeight = ref(600)
</script>

<style scoped>
#layout-body{
    /* header = 80px */
    min-height: -moz-calc(100vh - 80px);
    min-height: -webkit-calc(100vh - 80px);
    min-height: calc(100vh - 80px);
}
</style>
