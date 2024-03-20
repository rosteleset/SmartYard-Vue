import { Player as ShakaPlayer } from "shaka-player/dist/shaka-player.compiled";
import { StyleValue } from "vue";
import { Camera } from "../types/camera";
import axios from "axios";

abstract class Player {
  readonly camera: Camera;
  protected videoElement: HTMLVideoElement;
  protected stream: string = "";
  protected preview: string = "";
  readonly previewType: "video" | "image" = "video";
  protected aspectRatio: number = 1.6;
  protected isLoaded: boolean = false;
  protected player: ShakaPlayer | undefined;

  constructor(camera: Camera, videoElement: HTMLVideoElement) {
    if (!camera.token) throw new Error("no token");
    this.camera = camera;
    this.videoElement = videoElement;
  }

  readonly play = () => {
    this.videoElement.play();
  };
  readonly pause = () => {
    this.videoElement.pause();
  };
  abstract generatePreview(): void;
  abstract generateStream(from?: number, length?: number): void;
  readonly calculateAspectRatio = (): number => {
    this.aspectRatio =
      this.videoElement.videoWidth / this.videoElement.videoHeight ||
      this.aspectRatio;
    console.log(`ar - ${this.aspectRatio}`);

    return this.aspectRatio;
  };
  readonly getSize = (): StyleValue => {
    this.calculateAspectRatio();
    const containerWidth = window.innerWidth;
    const containerHeight = window.innerHeight;
    let newVideoWidth, newVideoHeight;
    if (containerWidth / this.aspectRatio > containerHeight) {
      newVideoWidth = containerHeight * 0.9 * this.aspectRatio;
      newVideoHeight = containerHeight * 0.9;
    } else {
      newVideoWidth = containerWidth * 0.9;
      newVideoHeight = (containerWidth * 0.9) / this.aspectRatio;
    }
    return {
      top: `${(containerHeight - newVideoHeight) / 2}px`,
      left: `${(containerWidth - newVideoWidth) / 2}px`,
      width: `${newVideoWidth}px`,
      height: `${newVideoHeight}px`,
    };
  };
  readonly initializeVideoStream = (): void => {
    const loader = (player: ShakaPlayer): Promise<void> => {
      return new Promise((resolve, reject) => {
        player
          .load(this.stream)
          .then(() => {
            resolve();
          })
          .catch((err) => {
            reject(err);
          });
      });
    };

    if (ShakaPlayer.isBrowserSupported()) {
      const player = this.player || new ShakaPlayer();
      player.configure({});
      player.attach(this.videoElement);
      loader(player);
      this.videoElement.addEventListener(
        "canplay",
        () => this.videoElement.play(),
        { once: true }
      );
    } else {
      console.error("Browser does not support Shaka Player");
    }
  };
}
// Flusonic
class FlussonicPlayer extends Player {
  constructor(camera: Camera, videoElement: HTMLVideoElement) {
    super(camera, videoElement);
    this.generatePreview();
    this.generateStream();
  }
  generatePreview = (): void => {
    const { url, token } = this.camera;
    this.preview = `${url}/preview.mp4?token=${token}`;
  };
  generateStream = (from?: number, length?: number): void => {
    const { url, hlsMode, token } = this.camera;
    const time = from && length ? `-${from}-${length}` : "";
    this.stream =
      hlsMode === "fmp4"
        ? `${url}/index${time}.fmp4.m3u8?token=${token}`
        : `${url}/index${time}.m3u8?token=${token}`;
    this.initializeVideoStream();
  };
}

// Forpost
class ForpostPlayer extends Player {
  readonly previewType = "image";

  constructor(camera: Camera, videoElement: HTMLVideoElement) {
    super(camera, videoElement);
    this.generatePreview();
    this.generateStream();
  }
  getForpostFormat = (from?: number) => {
    const url = this.camera.url;
    const speed = 1;
    const speedStr = speed < 1 ? speed.toFixed(2) : speed.toFixed(0);
    const tz = new Date().getTimezoneOffset() * 60;
    const parameters = from ? `&TS=${from}&TZ=${tz}&Speed=${speedStr}` : "";
    let urlBase = new URL(url + parameters + `&${this.camera.token}`);
    if (!urlBase || !urlBase.searchParams) {
      return "empty";
    }
    return urlBase.toString();
  };

  generatePreview = (): void => {
    const urlBase = new URL(this.getForpostFormat());

    urlBase.searchParams.delete("Format");
    urlBase.searchParams.append("Format", "JPG");

    const postParams = new URLSearchParams(urlBase.searchParams);
    urlBase.search = "";
    const _url = urlBase.href;

    axios.post(_url, postParams.toString()).then((response) => {
      const jsonData = response.data;
      this.preview = jsonData["URL"] || "empty";
    });
  };

  generateStream = (from?: number): void => {
    const urlBase = new URL(this.getForpostFormat(from));
    const postParams = new URLSearchParams(urlBase.searchParams);
    urlBase.search = "";
    const _url = urlBase.href;
    axios.post(_url, postParams.toString()).then((response) => {
      const jsonData = response.data;

      this.stream = jsonData["URL"] || "empty";
    });
  };
}

class PlayerFactory {
  static createPlayer(camera: Camera, videoElement: HTMLVideoElement) {
    switch (camera.serverType) {
      case "flussonic":
        return new FlussonicPlayer(camera, videoElement);
      case "forpost":
        return new ForpostPlayer(camera, videoElement);
      default:
        throw new Error("Unknown server type");
    }
  }
}

export { FlussonicPlayer, ForpostPlayer, Player, PlayerFactory };
