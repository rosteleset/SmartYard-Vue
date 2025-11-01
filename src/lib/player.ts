import Hls from "hls.js";
import axios from "axios";
import dayjs from "dayjs";

interface Camera {
    serverType: string;
    hlsMode?: string;
    url: string;
    token?: string;
}

interface PlayerParams {
    camera: Camera,
    videoElement: HTMLVideoElement,
    previewElement?: HTMLVideoElement,
    autoplay?: boolean,
    size?: number
}

type StyleValue = Record<string, string>

// Абстрактный класс Player, представляющий базовую модель плеера
abstract class Player {
    readonly camera: Camera; // Камера, с которой работает плеер
    protected videoElement: HTMLVideoElement; // HTML элемент видео
    protected previewElement?: HTMLVideoElement; // HTML элемент превью
    protected autoplay: boolean = false; // автовоспроизведение
    protected stream: string | undefined; // URL потока видео
    protected preview: string | undefined; // URL превью видео
    readonly previewType: "video" | "image" = "video"; // Тип превью
    protected aspectRatio: number = 1.6; // Соотношение сторон видео
    protected size: number = .9; // Размер видео
    protected isLoaded: boolean = false; // Флаг загрузки видео
    protected hls: Hls | undefined; // Инстанс Hls для воспроизведения видео

    // Конструктор класса Player
    protected constructor(params: PlayerParams) {
        this.camera = params.camera;
        this.videoElement = params.videoElement;
        this.previewElement = params.previewElement;
        this.autoplay = params.autoplay || false;
        if (params.size && params.size <= 1 && params.size >= 0)
            this.size = params.size;
    }

    // Метод для воспроизведения видео
    play() {
        if (this.hls) {
            this.autoplay = true;
            return this.videoElement.play();
        } else {
            return this.initializeVideoStream();
        }
    }

    // Метод для паузы видео
    pause() {
        this.autoplay = false;
        this.videoElement.pause();
    }

    setPreview() {
        try {
            if (!this.preview) {
                return;
            }

            if (this.previewType === "image") {
                this.videoElement.poster = this.preview;
                if (this.previewElement)
                    this.previewElement.poster = this.preview;
            } else if (this.previewType === "video" && this.previewElement) {
                this.previewElement.src = this.preview;
            }
        } catch (error: any) {
            console.warn("invalid preview");
        }
    }

    // Абстрактные методы для генерации превью и потока видео
    abstract generatePreview(): void;

    abstract generateStream(from?: number, length?: number): void;

    // Метод для расчета соотношения сторон видео
    calculateAspectRatio(): number {
        this.aspectRatio = this.videoElement.videoWidth / this.videoElement.videoHeight || this.aspectRatio;
        return this.aspectRatio;
    }

    // Метод для вычисления размеров видео
    getSize(): StyleValue {
        const aspectRatio = this.aspectRatio;
        const containerWidth = window.innerWidth;
        const containerHeight = window.innerHeight;
        let newVideoWidth, newVideoHeight;
        if (containerWidth / aspectRatio > containerHeight) {
            newVideoWidth = containerHeight * this.size * aspectRatio;
            newVideoHeight = containerHeight * this.size;
        } else {
            newVideoWidth = containerWidth * this.size;
            newVideoHeight = (containerWidth * this.size) / aspectRatio;
        }
        return {
            top: `${(containerHeight - newVideoHeight) / 2}px`,
            left: `${(containerWidth - newVideoWidth) / 2}px`,
            width: `${newVideoWidth}px`,
            height: `${newVideoHeight}px`,
        };
    }

    createPlayer() {
        if (Hls.isSupported()) {
            this.hls = new Hls();
            this.hls.attachMedia(this.videoElement);
        } else if (this.videoElement.canPlayType('application/vnd.apple.mpegurl')) {
            this.videoElement.src = this.stream || "";
        }
    }

    // Метод для инициализации видеопотока
    initializeVideoStream(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!this.stream) return reject("Doesn't have stream url");
            if (!Hls.isSupported() && !this.videoElement.canPlayType('application/vnd.apple.mpegurl')) {
                return reject("Browser does not support HLS");
            }
            this.createPlayer();
            if (this.hls) {
                this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
                    if (this.autoplay) {
                        this.videoElement.play().then(resolve).catch(reject);
                    } else {
                        resolve();
                    }
                });
                this.hls.loadSource(this.stream);
                this.hls.on(Hls.Events.ERROR, (_event, data) => {
                    if (data.fatal) {
                        switch (data.type) {
                            case Hls.ErrorTypes.NETWORK_ERROR:
                                console.warn("Network error encountered, retrying...");
                                this.hls?.startLoad();
                                break;
                            case Hls.ErrorTypes.MEDIA_ERROR:
                                console.warn("Media error encountered, attempting to recover...");
                                this.hls?.recoverMediaError();
                                break;
                            default:
                                this.hls?.destroy();
                                break;
                        }
                    }
                });
            } else {
                this.videoElement.src = this.stream || "";
                this.videoElement.addEventListener('loadedmetadata', () => {
                    if (this.autoplay) {
                        this.videoElement.play().then(resolve).catch(reject);
                    } else {
                        resolve();
                    }
                });
            }
        });
    }

    // Метод для удаления плеера
    onDestroy(): void {
        this.hls?.destroy();
    }
}

// Класс FlussonicPlayer, наследующийся от Player для работы с Flussonic сервером
class FlussonicPlayer extends Player {
    constructor(params: PlayerParams) {
        super(params);
        this.generatePreview();
        this.generateStream();
    }

    // Метод для генерации превью видео
    generatePreview = (): void => {
        const {url, token} = this.camera;
        this.preview = `${url}/preview.mp4?token=${token}`;
        this.setPreview();
    };

    // Метод для генерации потока видео
    generateStream = (from?: number, length?: number): void => {
        const {url, hlsMode, token} = this.camera;
        const time = from && length ? `-${from}-${length}` : "";
        this.stream = hlsMode === "fmp4"
            ? `${url}/index${time}.fmp4.m3u8?token=${token}`
            : `${url}/index${time}.m3u8?token=${token}`;
        if (this.autoplay) this.play();
    };
}

// Класс ForpostPlayer, наследующийся от Player для работы с Forpost сервером
class ForpostPlayer extends Player {
    readonly previewType = "image";

    constructor(params: PlayerParams) {
        super(params);
        this.generatePreview();
        this.generateStream();
    }

    // Метод для форматирования запроса к Forpost серверу
    getForpostFormat = (from?: number) => {
        const url = this.camera.url;
        const speed = 1;
        const speedStr = speed.toFixed(0);
        const tz = new Date().getTimezoneOffset() * -60;
        const parameters = from ? `&TS=${from}&TZ=${tz}&Speed=${speedStr}` : "";
        let urlBase = new URL(url + parameters + `&${this.camera.token}`);
        if (!urlBase || !urlBase.searchParams) {
            return "empty";
        }
        return urlBase.toString();
    };

    // Метод для генерации превью видео
    generatePreview = (): void => {
        const urlBase = new URL(this.getForpostFormat());
        urlBase.searchParams.delete("Format");
        urlBase.searchParams.append("Format", "JPG");
        const postParams = new URLSearchParams(urlBase.searchParams);
        urlBase.search = "";
        const _url = urlBase.href;
        axios.post(_url, postParams.toString()).then((response) => {
            const jsonData = response.data;
            const _preview: string | undefined = jsonData["URL"];
            if (_preview) {
                this.preview = _preview;
                this.setPreview();
            }
        });
    };

    forpostInit = () => {
        this.initializeVideoStream()
            .then(() => this.play())
            .catch((err) => {
                if (err.code !== 4000)
                    this.forpostInit();
            });
    }

    // Метод для генерации потока видео
    generateStream = (from?: number): void => {
        const urlBase = new URL(this.getForpostFormat(from));
        const postParams = new URLSearchParams(urlBase.searchParams);
        urlBase.search = "";
        const _url = urlBase.href;
        axios.post(_url, postParams.toString()).then((response) => {
            const jsonData = response.data;
            this.stream = jsonData["URL"] || "empty";
            if (this.autoplay) {
                this.forpostInit();
            }
        }).catch(() => {
            console.warn("Не удалось загрузить поток", _url, postParams.toString());
        });
    };
}

class NimblePlayer extends Player {
    constructor(params: PlayerParams) {
        super(params);
        this.generatePreview();
        this.generateStream();
    }

    // Метод для генерации превью видео
    generatePreview = (): void => {
        const {url, token} = this.camera;
        this.preview = `${url}/dvr_thumbnail.mp4?wmsAuthSign=${token}`;
        this.setPreview();
    };

    // Метод для генерации потока видео
    generateStream = (from?: number, length?: number): void => {
        const {url, token} = this.camera;
        if (from && length) {
            this.stream = `${url}/playlist_dvr_range-${from}-${length}.m3u8?wmsAuthSign=${token}`;
        } else {
            this.stream = `${url}/playlist.m3u8?wmsAuthSign=${token}`;
        }
        if (this.autoplay) this.play();
    };
}

class MacroscopPlayer extends Player {
    readonly previewType = "image";

    constructor(params: PlayerParams) {
        super(params);
        this.generatePreview();
        this.generateStream();
    }

    // Метод для генерации превью видео
    generatePreview = (): void => {
        const {url, token} = this.camera;
        let resultingString =
            "&withcontenttype=true&mode=realtime" +
            "&resolutionx=480&resolutiony=270&streamtype=mainvideo";
        let baseURL = new URL(url);
        baseURL.pathname = "/site";
        baseURL.search = token ? (baseURL.search || "") + `&${token}` : baseURL.search || "";
        baseURL.search += resultingString;
        this.preview = baseURL.href;
        this.setPreview();
    };

    // Метод для генерации потока видео
    generateStream = (from?: number, length?: number): void => {
        const DATE_FORMAT: string = 'DD.MM.YYYY HH:mm:ss';
        const {url, token} = this.camera;
        let parameters = "";
        if (from && length) {
            const formattedStartDate = dayjs(from).format(DATE_FORMAT);
            const formattedEndDate = dayjs(from).add(length, 'seconds').format(DATE_FORMAT);
            parameters = `&starttime=${formattedStartDate}&endtime=${formattedEndDate}`;
        }
        let _url =
            url +
            (token ? `&${token}` : "") +
            parameters;
        axios.get(_url).then((response) => {
            let resourceString = response.data;
            let baseURL = new URL(url);
            baseURL.pathname = "";
            baseURL.search = "";
            this.stream = baseURL.href + "hls/" + resourceString;
            if (this.autoplay) {
                this.play();
            }
        });
    };
}

// Фабрика PlayerFactory для создания плееров в зависимости от типа сервера
class PlayerFactory {
    static createPlayer(params: PlayerParams) {
        switch (params.camera.serverType) {
            case "flussonic":
                return new FlussonicPlayer(params);
            case "forpost":
                return new ForpostPlayer(params);
            case "nimble":
                return new NimblePlayer(params);
            case "macroscop":
                return new MacroscopPlayer(params);
            default:
                throw new Error("Unknown server type");
        }
    }
}

// Экспорт классов FlussonicPlayer, ForpostPlayer, Player и PlayerFactory
export {FlussonicPlayer, ForpostPlayer, Player, PlayerFactory};
