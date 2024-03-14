import Hls from "hls.js";
import { Camera } from "../types/camera";

// Функция для получения URL прямого эфира
const getLiveURL = (camera: Camera, from?: number, length?: number) => {
  const { serverType, url, hlsMode, token } = camera;
  let time = "";
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

// Функция для получения URL превью
const getPreviewURL = (camera: Camera) => {
  const { url, token } = camera;
  return `${url}/preview.mp4?token=${token}`;
};

// Функция для инициализации видеопотока
const initializeVideoStream = (
  streamUrl: string,
  videoElement: HTMLVideoElement
): Promise<Hls | undefined> => {
  return new Promise((resolve, reject) => {
    if (Hls.isSupported()) {
      const hls = new Hls({maxBufferLength:1});
      hls.loadSource(streamUrl);
      hls.attachMedia(videoElement);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        videoElement.play();
      });
      resolve(hls);

    } else if (videoElement.canPlayType("application/vnd.apple.mpegurl")) {
      videoElement.src = streamUrl;
      resolve(undefined);
      videoElement.addEventListener("loadedmetadata", () => {
        videoElement.play();
      });
    } else {
      reject("Video playback not supported");
    }
  });
};

export { getLiveURL, getPreviewURL, initializeVideoStream };
