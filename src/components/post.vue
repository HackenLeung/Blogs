<template>
    <article class="post post-list">
        <div class="post-entry">
            <div class="feature">
                <router-link :to="`/article/${post.id}`">
                    <img :src="post.banner" />
                </router-link>
            </div>
            <h1 class="entry-title">
                <router-link :to="`/article/${post.id}`"><span v-if="post.isTop"
                        style="color:#ff6d6d;font-weight:600">[置顶] </span>{{post.title}}</router-link>
            </h1>
            <div class="p-time">
                {{props.post.pubTime}}热度
            </div>
            <p class="summary">{{props.post.summary}}</p>
        </div>
    </article>
</template>

<script setup>
const props = defineProps({
    post: {
        type: Object
    }
})
</script>

<style scoped lang="scss">
.post {
    margin: 0 0 4% 0;
    position: relative;
}

.post-entry {
    .feature {
        position: absolute;
        margin-top: 10px;

        img {
            width: 100px;
            height: 100px;
            object-fit: cover;
            border-radius: 50%;
            padding: 2px;
            border: 1px solid #DADADA;
            position: relative;
            transition: all 0.2s linear;
            overflow: hidden;

            &:hover {
                transform: scale(1.1, 1.1);
                filter: contrast(130%);
            }
        }
    }

    .entry-title {
        font-size: 21px;
        font-weight: 600;
        line-height: 50px;
        margin: 0 0 0 17%;
        position: relative;
        z-index: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 70%;
        // color: #737373;

        & a:hover {
            color: #8fd0cc;
        }
    }

    .p-time {
        position: absolute;
        right: 0;
        top: 16px;
        font-size: 12px;
        color: #989898;
        letter-spacing: 1px;
        font-family: din, 'Hiragino Sans GB', 'Microsoft Yahei', Arial, sans-serif;
        display: flex;
        align-items: center;
    }

    p.summary {
        min-height: 60px;
        margin: 0 0 0 17%;
        font-size: 15px;
        // color: #6f6f6f;
        letter-spacing: 1px;
        line-height: 30px;
    }


}

.post hr {
    width: 30%;
    height: 1px;
    margin: 0 auto;
    border: 0;
    background: #EFEFEF;
}

/*******/

@media (max-width: 800px) {
    .post-entry {
        .feature img {
            width: 50px;
            height: 50px;
        }

        .entry-title {
            font-size: 16px;
            line-height: 30px;
            margin: 0 0 0 65px;
        }

        .p-time {
            position: relative;
            margin: -15px 0 0 65px;
        }

        p.summary {
            margin: 20px 0 0 65px;
            font-size: 14px;
            height: 30px;
            overflow: hidden;
        }

    }

    .post-list hr {
        margin-top: 20px;
    }
}

/******/
</style>
