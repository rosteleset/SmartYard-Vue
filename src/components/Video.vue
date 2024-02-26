<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { Camera } from '../api/cameras';
import Hls from 'hls.js';

const props = defineProps<{ camera: Camera }>();
const videoElement = ref<HTMLVideoElement | null>(null);
const streamUrl = ref("")


const getLiveURL = () => {
    const { serverType, url, hlsMode, token } = props.camera
    switch (serverType) {
        case 'nimble':
            return `${url}/playlist.m3u8?wmsAuthSign=${token}`;
        case 'flussonic':
            return hlsMode === 'fmp4' ?
                `${url}/index.fmp4.m3u8?token=${token}` :
                `${url}/index.m3u8?token=${token}`;
        default:
            return 'empty';
    }
}

onMounted(() => {
    streamUrl.value = getLiveURL()

    if (Hls.isSupported() && videoElement.value) {
        const hls = new Hls();
        hls.loadSource(streamUrl.value);
        hls.attachMedia(videoElement.value);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
            videoElement.value?.play();
        });
    } else if (videoElement.value?.canPlayType('application/vnd.apple.mpegurl')) {
        videoElement.value.src = streamUrl.value;
        videoElement.value.addEventListener('loadedmetadata', () => {
            videoElement.value?.play();
        });
    }
})

</script>

<template>
    <video controls autoplay ref="videoElement"></video>
</template>

<style scoped lang="scss">
</style>
