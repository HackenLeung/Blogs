<template>
    <div id="layout-footer">
        <div class="footer-main">
            <div class="footer-item" v-if="socials.length">
                <div v-for="item in socials" :key="item.id"><a target="_blank" class="out-link" :href="item.href"><i
                            class="iconfont" :class="item.icon"></i>{{ item.title }}</a></div>
            </div>
            <div class="footer-item">
                <div style="font-size:17px;font-weight: bold;">资源</div>
                <div><a target="_blank" class="out-link"
                        href="https://segmentfault.com/weekly?utm_source=sf-footer">每周精选</a></div>
                <div><a target="_blank" class="out-link" href="https://www.jmjc.tech/">简明教程</a></div>
                <div><a target="_blank" class="out-link" href="https://www.liaoxuefeng.com/">廖雪峰的官方网站</a></div>
            </div>
            <div class="footer-item">
                <div>本站已苟活 {{ 1234 }}</div>
                <div><a target="_blank" class="out-link" href="#">☞后台管理</a></div>
            </div>
        </div>
        <div class="copyright"> <a target="_blank" class="out-link"
                href="#">备案号-1</a></div>
    </div>
</template>

<script setup>
import { useMainStore } from '../../store/main' // import the store from the main.ts file and use it in the template. It's not a direct dependency
const socials = reactive([]);
const mainStore = useMainStore();
//  runTimeInterval
onMounted(() => {
    console.log(mainStore,'mainStore');
    
})
</script>

<style scoped lang="scss">
#layout-footer {
    padding: 2%;
    border-top: 1px solid #F7F7F7;
    font-size: 13px;
    color: #9c9c9c;

    a.out-link:hover {
        color: #ff6d6d;
    }

    .footer-main {
        max-width: 800px;
        margin: 0 auto 20px auto;
        display: flex;
        justify-content: space-around;
        align-items: flex-start;

        .footer-item {
            flex: 1;

            &>div:not(:last-child) {
                margin-bottom: 10px;
            }

            i {
                margin-right: 10px;
            }
        }
    }

    .copyright {
        text-align: center;
    }
}

/*****/
@media (max-width: 800px) {
    #layout-footer {
        .footer-main .footer-item:nth-child(3) {
            flex: 2;
        }
    }
}

@media (max-width: 600px) {
    #layout-footer {
        .footer-main {
            display: block;

            .footer-item {
                display: flex;
                justify-content: space-around;
                align-items: center;
                flex-wrap: wrap;

                &>div {
                    margin-bottom: 10px;
                }
            }
        }
    }
}

/*****/</style>