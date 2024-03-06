import Hls from "hls.js";
import { Camera } from "../types/camera";

const getLiveURL = (camera: Camera, from?: number, length?: number) => {
  const { serverType, url, hlsMode, token } = camera;
  let time="";
  if (from && length) time = `-${from}-${length}`;
  switch (serverType) {
    case "nimble":
      return `${url}/playlist.m3u8?wmsAuthSign=${token}`;
    case "flussonic":
      return hlsMode === "fmp4"
        ? `${url}/index${time}.fmp4.m3u8?token=${token}`
        : `${url}/index${time}.m3u8?token=${token}`;
    default:
      return "empty";
  }
};

const getPreviewURL = (camera: Camera) => {
  const { url, token } = camera;

  return `${url}/preview.mp4?token=${token}`;
};

const getIframe = (camera: Camera, from?: string, to?: string) => {
  const { serverType, url, token } = camera;

  switch (serverType) {
    case "flussonic":
      let timeMark: string | undefined;
      if (from && to) timeMark = `&from=${from}&to=${to}`;
      return `${url}/embed.html?dvr=true&token=${token}`;
    default:
      return "empty";
  }
};

const initializeVideoStream = (
  streamUrl: string,
  videoElement: HTMLVideoElement
): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(streamUrl);
      hls.attachMedia(videoElement);
      videoElement.addEventListener("playing", () => {
        resolve("Video playback started");
      });
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        videoElement.play();
      });
    } else if (videoElement.canPlayType("application/vnd.apple.mpegurl")) {
      videoElement.src = streamUrl;
      videoElement.addEventListener("playing", () => {
        resolve("Video playback started");
      });
      videoElement.addEventListener("loadedmetadata", () => {
        videoElement.play();
      });
    } else {
      reject("Video playback not supported");
    }
  });
};

export { getLiveURL, getPreviewURL, initializeVideoStream, getIframe };
