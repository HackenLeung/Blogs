<template>
    <div class="header-search">
        <i class="iconfont iconsearch" @click.stop="click"></i>
        <input ref="searchInput" :class="{'show':show}" v-model="searchValue" type="text" @click.stop=""
            @keyup.enter="search" />
    </div>
</template>

<script setup lang="ts">
let searchValue = ref<string>('');
let show = ref<Boolean>(false);
watch(show, (value) => {
    if (value) {
        document.body.addEventListener('click', close)
    } else {
        document.body.removeEventListener('click', close)
    }
})
const router = useRouter();
const searchInput = ref(null)
function search() {
    // console.log(this.searchValue)
    router.push({ name: 'search', query: { words: searchValue.value } });
    close()
}
function click() {
    console.log('点击了吗',searchInput.value);
    searchValue.value = ''
    show.value = !show.value
    if (show) {
        searchInput.value && searchInput.value.focus()
    }
}
function close() {
    searchInput && searchInput.value.blur()
    show.value = false
}
</script>

<style scoped lang="scss">
.header-search {
    display: inline-block;
    position: relative;

    i {
        font-size: 18px;
        position: relative;
        top: 3px;
    }

    input {
        border: none;
        outline: none;
        overflow: hidden;
        background: transparent;
        height: 30px;
        width: 0;
        transition: .2s all;

        &.show {
            width: 200px;
            margin-left: 10px;
        }

        &:focus {
            border-bottom: 1px solid #8fd0cc;
        }
    }
}
</style>
