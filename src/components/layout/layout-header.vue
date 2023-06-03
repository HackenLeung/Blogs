<template>
    <div id="layout-header" :class="{ 'fixed': fixed, 'hidden': hidden }" @click.stop="mobileShow = false">
        <div class="site-logo">
            <!-- <router-link to="/">
                <img src="@/assets/site-logo.svg" alt="">
                <p class="site-name">Gblog</p>
            </router-link> -->
        </div>
        <div class="menus-btn" @click.stop="mobileShow = !mobileShow">
            Menus
        </div>
        <div class="site-menus" :class="{ 'mobileShow': mobileShow }" @click.stop="mobileShow = !mobileShow">
            <div class="menu-item header-search">
                <header-search />
            </div>
            <div class="menu-item">
                <router-link to="/">首页</router-link>
            </div>
            <div class="menu-item hasChild">
                <a href="#">文章</a>
                <div class="childMenu" v-if="category.length">
                    <div class="sub-menu" v-for="item in category">
                        <router-link :to="`/category/${item.title}`">{{ item.title }}</router-link>
                    </div>
                </div>
            </div>
            <div class="menu-item">
                <router-link to="/friend">友链</router-link>
            </div>
            <div class="menu-item">
                <router-link to="/about">关于</router-link>
            </div>
            <div class="menu-item">
                <router-link to="/text">测试</router-link>
            </div>
            <div class="menu-item">
                <el-icon @click="toggleTheme">
                    <Sunny v-if="isDark"/>
                    <Moon v-else/>
                </el-icon>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Sunny, Moon } from '@element-plus/icons-vue'

interface categoryData {
    title: String,
    id: Number,
    href: String
}

let lastScrollTop = ref<Number>(0);
let fixed = ref<Boolean>(false);
let hidden = ref<Boolean>(false);
let mobileShow = ref<Boolean>(false);
let isDark = ref<Boolean>(true);
let category = reactive<categoryData[]>([
    {
        id: 1,
        title: 'JAVA',
        href: '/category/java'
    },
    {
        id: 2,
        title: 'SpringBoot',
        href: '/category/SpringBoot',
    },
    {
        id: 3,
        title: 'MySql',
        href: '/category/MySql'
    },
    {
        id: 4,
        title: '随笔',
        href: '/category/live'
    }
]);

onMounted(() => {
    window.addEventListener('scroll', watchScroll)
})

onUnmounted(() => {
    window.removeEventListener("scroll", watchScroll)
})

function watchScroll() {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
    if (scrollTop === 0) {
        fixed.value = false;
    } else if (scrollTop >= lastScrollTop.value) {
        fixed.value = false;
        hidden.value = true;
    } else {
        fixed.value = true
        hidden.value = false
    }
    lastScrollTop.value = scrollTop
}
const toggleTheme = (event: MouseEvent) => {
    const x = event.clientX;
    const y = event.clientY;
    const endRadius = Math.hypot(
        Math.max(x, innerWidth - x),
        Math.max(y, innerHeight - y)
    );

    // let isDark: boolean;
    // @ts-ignore
    const transition = document.startViewTransition(() => {
        const root = document.documentElement;
        isDark.value = root.classList.contains("dark");
        root.classList.remove(isDark.value ? "dark" : "light");
        root.classList.add(isDark.value ? "light" : "dark");
    });
    transition.ready.then(() => {
        const clipPath = [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`,
        ];
        document.documentElement.animate(
            {
                clipPath: isDark.value ? clipPath.reverse() : clipPath,
            },
            {
                duration: 200,
                easing: "ease-in",
                pseudoElement: isDark.value ? "::view-transition-old(root)" : "::view-transition-new(root)",
            }
        );
    });

};


</script>

<style scoped lang="scss">
#layout-header {
    position: fixed;
    top: 0;
    z-index: 9;
    width: 100%;
    height: 80px;
    padding: 0 80px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: .3s all ease;
    -webkit-transition: .3s all ease;
    -moz-transition: .3s all linear;
    -o-transition: .3s all ease;
    -ms-transition: .3s all ease;

    &.hidden {
        top: -100px;
    }

    &.fixed {
        background-color: #FFFFFF;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    }
}

.site-logo {
    text-align: center;

    img {
        width: 60px;
        height: 60px;
    }

    p.site-name {
        font-size: 15px;
        font-weight: bold;
        position: relative;
        top: -10px;
    }
}

.menus-btn {
    display: none;
    visibility: hidden;
}

.site-menus {
    display: flex;
    align-items: center;

    .menu-item {
        min-width: 60px;
        height: 50px;
        line-height: 50px;
        text-align: center;
        position: relative;

        a {
            padding: 12px 10px;
            // color: #545454;
            font-weight: 500;
            font-size: 16px;

            &:hover {
                color: #ff6d6d;
            }
        }

        &:not(:last-child) {
            margin-right: 15px;
        }

        &.hasChild:hover .childMenu {
            opacity: 1;
            visibility: visible;
            transform: translateY(-5px);
        }
    }

    .childMenu {
        width: 130px;
        background-color: #FDFDFD;
        border-radius: 3px;
        border: 1px solid #ddd;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        position: absolute;
        top: 55px;
        z-index: 2;
        opacity: 0;
        visibility: hidden;
        transition: .7s all ease;
        -webkit-transition: .6s all ease;
        -moz-transition: .6s all linear;
        -o-transition: .6s all ease;
        -ms-transition: .6s all ease;

        &:before,
        &:after {
            content: '';
            position: absolute;
            width: 0;
            height: 0;
            border-left: 6px solid transparent;
            border-right: 6px solid transparent;
            border-bottom: 8px solid white;
            top: -8px;
            left: 20px;
        }

        &:before {
            top: -9px;
            border-bottom: 8px solid #ddd;
        }

        .sub-menu {
            height: 40px;
            line-height: 40px;
            position: relative;

            &:not(:last-child):after {
                /*position: absolute;*/
                content: '';
                width: 50%;
                height: 1px;
                color: #ff6d6d;
                bottom: 0;
                left: 25%;
                z-index: 99;
            }
        }
    }
}

@media (max-width: 960px) {
    #layout-header {
        padding: 0 20px;
    }
}

@media (max-width: 600px) {
    #layout-header {
        padding: 0 10px;
    }

    .menus-btn {
        display: block;
        visibility: visible;
    }

    .site-menus {
        position: absolute;
        display: none;
        visibility: hidden;
        background-color: #F9F9F9;
        width: 100%;
        left: 0;
        top: 80px;
        z-index: -9;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

        .menu-item {
            position: relative;
            height: unset;

            &:not(:last-child) {
                margin-right: 0;
            }
        }

        .childMenu {
            position: relative;
            width: 100%;
            top: 0;
            background-color: #F3F3F3;
            opacity: 1;
            visibility: visible;
            border: none;
            box-shadow: none;

            &:before,
            &:after {
                content: '';
                position: relative;
                width: 0;
                height: 0;
                border-left: 0;
                border-right: 0;
                border-bottom: 0;
            }
        }
    }

    .site-menus.mobileShow {
        display: inline-block;
        visibility: visible;
        z-index: 99;
    }
}
</style>
