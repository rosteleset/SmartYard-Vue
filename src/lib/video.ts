import Hls from "hls.js";
import { Player } from "shaka-player/dist/shaka-player.compiled";
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
      const hls = new Hls({ maxBufferLength: 1 });
      hls.loadSource(streamUrl);
      hls.attachMedia(videoElement);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        videoElement.play();
      });
      hls.on(Hls.Events.ERROR, () => console.log("oops"));
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

const initializeVideoStreamShaka = (
  streamUrl: string,
  videoElement: HTMLVideoElement
): Player | undefined => {
  if (Player.isBrowserSupported()) {
    const player = new Player(videoElement);

    player
      .load(streamUrl)
      .then(() => {
        console.log("Video loaded");
        videoElement.play();
      })
      .catch((err) => {
        console.error("Error loading video", err);
      });

    return player;
  } else {
    console.error("Browser does not support Shaka Player");
  }
};

export {
  getLiveURL,
  getPreviewURL,
  initializeVideoStream,
  initializeVideoStreamShaka,
};
