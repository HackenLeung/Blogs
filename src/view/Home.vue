<template>
    <div class="home">
        <!-- <banner isHome="true"></banner> -->
        <div class="site-content animate">
            <!--通知栏-->
            <div class="notify">
                <div class="search-result" v-if="hideSlogan">
                    <span v-if="searchWords">搜索结果："{{searchWords}}" 相关文章</span>
                    <span v-else-if="category">分类 "{{category}}" 相关文章</span>
                </div>
                <quote v-else>{{notice}}</quote>
            </div>

            <!--焦点图-->
            <div class="top-feature" v-if="!hideSlogan">
                <section-title>
                    <div style="display: flex;align-items: flex-end;">聚焦<small-ico></small-ico>
                    </div>
                </section-title>
                <div class="feature-content">
                    <div class="feature-item" v-for="item in features" :key="item.title">
                        <Feature :data="item"></Feature>
                    </div>
                </div>
            </div>
            <!--文章列表-->
            <main class="site-main" :class="{'search':hideSlogan}">
                <section-title v-if="!hideSlogan">推荐</section-title>
                <template v-for="item in postList">
                    <post :post="item"></post>
                </template>
            </main>

            <!--加载更多-->
            <div class="more" v-show="hasNextPage">
                <div class="more-btn">More</div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps(['cate', 'words']);
const features = reactive([
    {
        id: 1,
        title: 'Akina',
        img: 'https://s1.ax1x.com/2020/05/14/YDfRnU.jpg'
    },
    {
        id: 2,
        title: '使用说明',
        img: 'https://s1.ax1x.com/2020/05/14/YDf4AJ.jpg'
    },
    {
        id: 3,
        title: '文章归档',
        img: 'https://s1.ax1x.com/2020/05/14/YDfT91.jpg'
    }
]);
const postList = reactive([
  {
    id: 0,
    isTop: true,
    banner: 'https://s1.ax1x.com/2020/05/14/YDhagx.jpg',
    isHot: true,
    pubTime: 1256894124832,
    title: '看一遍闭着眼都会安装Lua了',
    summary: 'Lua 是一种轻量小巧的脚本语言，能为应用程序提供灵活的扩展和定制功能。',
    content: '',
    viewsCount: 4045,
    commentsCount: 99
  },
  {
    id: 1,
    isTop: false,
    banner: 'https://s1.ax1x.com/2020/05/14/YDhagx.jpg',
    isHot: false,
    pubTime: 1617264176414,
    title: '油来据列处王劳直质群思处',
    summary: '达展至马广率记省原格问林性政认。界种始回当个九装中红劳市示史准。但各国备信前只入油群积济人有明小。心儿复列候派确变强经来我么族。意见国空约土矿五切才观被划再在月。科根全便务过可建土治表织九飞话共。京易大体革适听军区条照置立。',
    content: '<p>I am testing data, I am testing data.</p><p><img src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>',
    viewsCount: 4915,
    commentsCount: 199
  },
  {
    id: 2,
    isTop: false,
    banner: 'https://s1.ax1x.com/2020/05/14/YDhU81.jpg',
    isHot: true,
    pubTime: 1448425522935,
    title: '数省气装到了史去合严商保',
    summary: '图采同较化员目给可当厂起而毛。象按业空示务办持置率到声心。照象改号面复容族值院史事易而然设。还史须年律有所一历情儿更斯西可持写层。',
    content: '<p>I am testing data, I am testing data.</p><p><img src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>',
    viewsCount: 729,
    commentsCount: 176
  },
  {
    id: 3,
    isTop: true,
    banner: 'https://s1.ax1x.com/2020/05/14/YDhBDO.jpg',
    isHot: false,
    pubTime: 1562794593857,
    title: '定点并究织每认化二习商动并林',
    summary: '时六近型北级称压向大段已目世各真。况压选术支米目前海造志交口。与立往置县已表织特实铁运内基件。住县领之化例查真效飞又色特律花山。',
    content: '<p>I am testing data, I am testing data.</p><p><img src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>',
    viewsCount: 4787,
    commentsCount: 148
  },
  {
    id: 4,
    isTop: false,
    banner: 'https://s1.ax1x.com/2020/05/14/YDhoVg.jpg',
    isHot: true,
    pubTime: 546405661942,
    title: '机酸果场何形活术识政子直产变',
    summary: '时传京观圆常还很证完高火约有成求县。九选省会新你步几使界联分采业万写给。力度法手提即组步象报三矿连她以该次律。花管看也元例称西团级专平次他。想近得张少入真什非林标革。无多思越出布为者参者马长术么决。第们本期文效较道将空件京理。',
    content: '<p>I am testing data, I am testing data.</p><p><img src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>',
    viewsCount: 3474,
    commentsCount: 166
  },
  {
    id: 5,
    isTop: true,
    banner: 'https://s1.ax1x.com/2020/05/14/YD4FR1.jpg',
    isHot: false,
    pubTime: 525285810696,
    title: '红状构周应完己事装革证以办布口',
    summary: '对他又养个十号了达劳思各们。按数电条东电斯快际离声下群指些研。取儿少力果山民等公直信感没。其直入十就时维济会十力低五由。提联外党文证学来以五受取业先南风断。',
    content: '<p>I am testing data, I am testing data.</p><p><img src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>',
    viewsCount: 3611,
    commentsCount: 128
  },
  {
    id: 6,
    isTop: false,
    banner: 'https://s1.ax1x.com/2020/05/14/YDhagx.jpg',
    isHot: false,
    pubTime: 1313965564141,
    title: '月西可证开主质究心它类农石写太月以意',
    summary: '米易育术并素作比习劳条万计组改认。市布先步取本照很数主已点及年导。义空机基方年力最里十去前多主。铁民难存往精格证斗志元小给广矿头。目响业六那它队进社下论九。',
    content: '<p>I am testing data, I am testing data.</p><p><img src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>',
    viewsCount: 2095,
    commentsCount: 107
  },
  {
    id: 7,
    isTop: false,
    banner: 'https://s1.ax1x.com/2020/05/14/YDhU81.jpg',
    isHot: false,
    pubTime: 1324271698628,
    title: '美南研证消识外织制于导水人厂给水好等院积',
    summary: '约比真强素住治名门非头同以边生影。此院效且教近低青层我技除思。低只备思学比造后满连示要统县它它。需技需厂除放华儿志局明准去几展圆。王半型价场属容发着社但院数命十传。',
    content: '<p>I am testing data, I am testing data.</p><p><img src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>',
    viewsCount: 1500,
    commentsCount: 17
  },
  {
    id: 8,
    isTop: false,
    banner: 'https://s1.ax1x.com/2020/05/14/YDhBDO.jpg',
    isHot: false,
    pubTime: 617594673806,
    title: '规听克者点已区低且利铁最研条向平响',
    summary: '干图话收做情意可更去体的委准。平感准价众己开后产全委更离参处。且别照复满响社起路下热同米路带。快叫究节全是县位没据办满器人从主。眼海们极低动广着器品所边她标准对百却。细农易今总图百事叫候合再县科进土在。都派过会己都等连教制省东。',
    content: '<p>I am testing data, I am testing data.</p><p><img src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>',
    viewsCount: 3680,
    commentsCount: 50
  },
  {
    id: 9,
    isTop: false,
    banner: 'https://s1.ax1x.com/2020/05/14/YDhoVg.jpg',
    isHot: false,
    pubTime: 293906034652,
    title: '组水又成计主料七走金种好把长',
    summary: '引过动建候斯器气被记手所即次识生断。件从层么效集者能议于厂持书。听最准文把织七增派更品育线习林。见门据毛参斗办八机用去对进。万报局打写与叫义立几构料生。料斗只争山好一从步员实特工示做马热且。',
    content: '<p>I am testing data, I am testing data.</p><p><img src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>',
    viewsCount: 4955,
    commentsCount: 129
  }
]);
let currPage = ref(1);
let hasNextPage = ref(false);

const router = useRouter();
const searchWords = router.currentRoute.value.params.words;
const category = router.currentRoute.value.params.cate;
const hideSlogan = category || searchWords
const notice = ref('')


onMounted(() => {
})
</script>
<style scoped lang="scss">
.site-content {
    .notify {
        margin: 60px 0;
        border-radius: 3px;

        &>div {
            padding: 20px;
        }
    }


    .search-result {
        padding: 15px 20px;
        text-align: center;
        font-size: 20px;
        font-weight: 400;
        border: 1px dashed #ddd;
        color: #828282;
    }
}

.top-feature {
    width: 100%;
    height: auto;
    margin-top: 30px;

    .feature-content {
        margin-top: 10px;
        display: flex;
        justify-content: space-between;
        position: relative;

        .feature-item {
            width: 32.9%;
        }
    }
}

.site-main {
    padding-top: 80px;

    &.search {
        padding-top: 0;
    }
}

.more {
    margin: 50px 0;

    .more-btn {
        width: 100px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        color: #ADADAD;
        border: 1px solid #ADADAD;
        border-radius: 20px;
        margin: 0 auto;
        cursor: pointer;

        &:hover {
            color: #8fd0cc;
            border: 1px dashed #8fd0cc;
        }
    }
}

/******/
@media (max-width: 800px) {
    .top-feature {
        display: none;
    }

    .site-main {
        padding-top: 40px;
    }

    .site-content {
        .notify {
            margin: 30px 0 0 0;
        }

        .search-result {
            margin-bottom: 20px;
            font-size: 16px;
        }
    }
}

/******/
</style>
