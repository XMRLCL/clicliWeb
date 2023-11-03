<template>
    <div class="player-container">
        <w-player class="player" :key="playerKey" :options="options" :danmaku-key="danmakuKey"></w-player>
    </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref, watch } from 'vue';
import dashjs from "dashjs";
import { WPlayer } from 'vue-wplayer';
import flvjs from 'flv.js';
import 'vue-wplayer/dist/style.css';
import type { ResourceType, AddHistoryType, AddDanmakuType } from '@leaf/apis';
import {sendDanmakuAPI, getDanmakuAPI} from '@leaf/apis';
import { addHistoryAPI, getHistoryProgressAPI } from '@leaf/apis';
import type { OptionsType, QualityType } from '../types/player';
import { getResourceUrl, statusCode } from '@leaf/utils';
import request from "@leaf/apis/src/request";

const props = withDefaults(defineProps<{
    vid: number,
    theme: string,
    mobile?: boolean,
    resources: Array<ResourceType>,
    part: number,
}>(), {
    part: 1,
    mobile: false
})
let danmakuKey = ref(0);
let startTime = 0;
const playerKey = ref(0);
let dash: dashjs.MediaPlayerClass;

const options: OptionsType = {
    resource: [],
    type: "dash",
    customType: (player: HTMLVideoElement, url: string) => {
        dash = dashjs.MediaPlayer().create();
        dash.initialize(player, url, false, startTime);
    },
    customQualityChange: (quality: string) => {
        const trackIndex = getTrackIndex(Number(quality));
        const tracks = dash.getTracksFor("video");
        if (trackIndex >= tracks.length) {
            dash.setCurrentTrack(tracks[tracks.length - 1])
        } else {
            dash.setCurrentTrack(tracks[trackIndex])
        }
    },
    mobile: props.mobile,
    theme: props.theme,
    danmaku: {
        open: true,
        data: [],
        send: (danmaku: AddDanmakuType) => {
            sendDanmaku(danmaku);
        }
    }
}


// let options = {
//   resource: "",
//   type: "custom",
//   customType: function (player: HTMLVideoElement, url: string) {
//     const flv = flvjs.createPlayer({
//       type:'flv',
//       url: url,
//     });
//     flv.attachMediaElement(player);
//     flv.load();
//   },
//   danmaku: {
//     open: true,
//     data: [],
//     send: (danmaku: AddDanmakuType) => {
//       sendDanmaku(danmaku);
//     }
//   }
// }

const getTrackIndex = (quality: number) => {
    switch (quality) {
        case 360:
            return 0;
        case 480:
            return 1;
        case 720:
            return 2;
        case 1080:
            return 3;
        default:
            return Number.MAX_SAFE_INTEGER
    }
}

const getVideoFlvAPI = (id: number) => {
  return request.post('v1/video/url/get', {id})
}

// 加载
const loadPart = async (part: number) => {
    loadResource(part);
    startTime = await getHistoryProgress();
    await getDanmaku(part);
    // let url = await getVideoFlvAPI(props.vid);
    // console.log(url.data);
    // options.resource = url.data.data.url;
    playerKey.value = Date.now();
}

const loadResource = (part: number) => {
    let tmpResource: QualityType = {};

    switch (props.resources[part - 1].quality) {
        case 1080:
            tmpResource[1080] = {
                name: "1080P",
                url: getResourceUrl(props.resources[part - 1].url),
            }
        case 720:
            tmpResource[720] = {
                name: "720P",
                url: getResourceUrl(props.resources[part - 1].url),
            }
        case 480:
            tmpResource[480] = {
                name: "480P",
                url: getResourceUrl(props.resources[part - 1].url),
            }
        case 360:
            tmpResource[360] = {
                name: "360P",
                url: getResourceUrl(props.resources[part - 1].url),
            }
    }
    // console.log(tmpResource);
    options.resource = tmpResource;
}

// 获取播放进度
const getHistoryProgress = async () => {
    const res = await getHistoryProgressAPI(props.vid);
    if (res.data.code === statusCode.OK) {
        if (res.data.data.progress.part === props.part) {
            return res.data.data.progress.time;
        }
    }
}

watch(() => props.part, (val) => {
    loadPart(val);
});

// 上传历史记录
const uploadHistory = async () => {
    const history: AddHistoryType = {
        vid: props.vid,
        part: props.part,
        time: dash.time()
    }
    await addHistoryAPI(history);
}

const sendDanmaku = (danmakuForm: AddDanmakuType) => {
    console.log(danmakuForm.time);
    danmakuForm.vid = props.vid;
    danmakuForm.part = props.part;
    sendDanmakuAPI(danmakuForm);
}

const getDanmaku = async (part: number) => {
    if (options.danmaku.data) options.danmaku.data = [];
    const res = await getDanmakuAPI(props.vid, part);
    if (res.data.code === statusCode.OK) {
        const list = res.data.data.danmaku;
        if (list) {
            options.danmaku!.data = list;
        }
    }
}

onBeforeMount(() => {
    loadPart(props.part);
    window.addEventListener("unload", uploadHistory);
});
</script>

<style lang="less" scoped>
.player-container {
    height: 0;
    width: 100%;
    padding-bottom: 56.25%;
    position: relative;
    margin-bottom: 40px;

    .player {
        width: 100%;
        height: 100%;
        position: absolute;
        background-color: black;
    }
}
</style>