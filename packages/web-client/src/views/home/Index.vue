<template>
    <div class="home" :style="initTheme()" v-title :data-title="`${title}`">
        <header-bar></header-bar>
        <div class="home-content">
            <div class="home-left" :class="menuFold ? 'home-left-fold' : ''">
<!--                <home-sidebar class="home-sidebar" :fold="menuFold"></home-sidebar>-->
            </div>
            <div class="home-right">
                <div class="home-recommended" :class="menuFold ? 'recommended-fold' : ''">
                    <div class="recommended-carousel">
                        <HomeCarousel></HomeCarousel>
                    </div>
                    <video-item v-for="item in videoList" :info="item"></video-item>
                </div>
            </div>
        </div>
      <a style="position:fixed;text-align:center;bottom:0;margin:0 auto;text-decoration: none;width:100%;color: #757a82" href="https://beian.miit.gov.cn/" target="_blank">陕ICP备2022004199号-2</a>
    </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import { getTheme } from '@/theme';
import HomeSidebar from './component/HomeSidebar.vue';
import HomeHeader from "./component/HomeHeader.vue";
import HomeCarousel from './component/HomeCarousel.vue';
import type { AnnounceType, VideoType } from "@leaf/apis";
import HeaderBar from "@/components/header-bar/Index.vue";
import { getImportantAnnounceAPI, getRecommendedVideoAPI } from "@leaf/apis";
import VideoItem from '@/components/video-item/Index.vue';
import { globalConfig, statusCode } from '@leaf/utils';
import { useDialog } from 'naive-ui';

const dialog = useDialog();
const title = ref(window.$title || globalConfig.title);

const menuFold = ref(false);
const changeMenuFold = (val: boolean) => {
    menuFold.value = val;
}

const initTheme = () => {
    const theme = getTheme();

    return {
        "--primary-color": theme.primaryColor
    }
}

const videoList = ref<Array<VideoType>>([]);
const getRecommendedVideo = () => {
    getRecommendedVideoAPI(12).then((res) => {
        if (res.data.code === statusCode.OK) {
            videoList.value = res.data.data.videos;
        }
    })
  console.log(videoList);
}

onBeforeMount(() => {
    getRecommendedVideo();
    getImportantAnnounceAPI().then((res) => {
        if (res.data.code === statusCode.OK) {
            const announce: AnnounceType = res.data.data.announce;
            const readAnnounceList: Array<number> = JSON.parse(localStorage.getItem("read_announce_id") || "[]")
            if (announce.id !== 0 && !readAnnounceList.includes(announce.id)) {
                readAnnounceList.push(announce.id);
                localStorage.setItem("read_announce_id", JSON.stringify(readAnnounceList));
                dialog.info({
                    title: announce.title,
                    content: announce.content,
                    positiveText: '已读',
                })
            }
        }
    })
})
</script>

<style lang="less" scoped>
.home {
    width: 100%;
    min-width: 1200px;
    height: 100vh;

    .home-header {
        position: fixed;
        top: 0;
        width: 100%;
        z-index: 999;
        background-color: #fff;
    }
}

.home-content {
    display: flex;
    margin-top: 60px;

    .home-left {
        width: 220px;
        transition: width .25s;

        .home-sidebar {
            position: fixed;
        }
    }

    .home-left-fold {
        width: 50px;
    }

    .home-right {
        flex: 1;
    }
}

.home-recommended {
    display: grid;
    margin-left: 20px;
    width: calc(100% - 50px);
    gap: 0 16px;
    grid-template-columns: repeat(4, 1fr);
    overflow: hidden;

    .recommended-carousel {
        height: 420px;
        grid-row: 1/ span 2;
        grid-column: 1/ span 2;
    }
}

.recommended-fold {
    max-height: 780px;
    grid-template-columns: repeat(5, 1fr);
}
</style>