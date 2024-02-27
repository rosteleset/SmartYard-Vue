import Hls from "hls.js";
import { Camera } from "../api/cameras";

const getLiveURL = (camera: Camera) => {
    const { serverType, url, hlsMode, token } = camera
    switch (serverType) {
        case 'nimble':
            return `${url}/playlist.m3u8?wmsAuthSign=${token}`
        case 'flussonic':
            return hlsMode === 'fmp4' ?
                `${url}/index.fmp4.m3u8?token=${token}` :
                `${url}/index.m3u8?token=${token}`;
        default:
            return 'empty';
    }
}

const getPreviewURL = (camera: Camera) => {
    const { url, token } = camera

    return `${url}/preview.mp4?token=${token}`;
}

const initializeVideoStream = (streamUrl: string, videoElement: HTMLVideoElement): Promise<string> => {
    return new Promise((resolve, reject) => {
        if (Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(streamUrl);
            hls.attachMedia(videoElement);
            videoElement.addEventListener('playing', () => {
                resolve("Video playback started");
            });
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                videoElement.play();
            });
        } else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
            videoElement.src = streamUrl;
            videoElement.addEventListener('playing', () => {
                resolve("Video playback started");
            });
            videoElement.addEventListener('loadedmetadata', () => {
                videoElement.play();
            });
        } else {
            reject("Video playback not supported");
        }
    });
}

export { getLiveURL, getPreviewURL, initializeVideoStream }