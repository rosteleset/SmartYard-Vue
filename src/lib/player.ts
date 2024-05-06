// @ts-ignore
import {Player as ShakaPlayer} from "shaka-player";
import axios from "axios";
import dayjs from "dayjs";

interface Camera {
    serverType: string;
    hlsMode?: string;
    url: string;
    token: string;
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
    protected size: number = .9; // Соотношение сторон видео
    protected isLoaded: boolean = false; // Флаг загрузки видео
    player: ShakaPlayer | undefined; // Инстанс ShakaPlayer для воспроизведения видео

    // Конструктор класса Player
    protected constructor(params: PlayerParams) {
        if (!params.camera.token) throw new Error("no token"); // Проверка наличия токена у камеры
        this.camera = params.camera;
        this.videoElement = params.videoElement;
        this.previewElement = params.previewElement;
        this.autoplay = params.autoplay || false;
        if (params.size && params.size <= 1 && params.size >= 0)
            this.size = params.size
    }

    // Метод для воспроизведения видео
    play() {
        if (this.player)
            return this.videoElement.play();
        else
            return this.initializeVideoStream()
    }

    // Метод для паузы видео
    pause() {
        this.videoElement.pause();
    }

    setPreview() {
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
    }

    // Абстрактные методы для генерации превью и потока видео
    abstract generatePreview(): void;

    abstract generateStream(from?: number, length?: number): void;

    // Метод для расчета соотношения сторон видео
    calculateAspectRatio(): number {
        this.aspectRatio =
            this.videoElement.videoWidth / this.videoElement.videoHeight ||
            this.aspectRatio;
        console.log(`ar - ${this.aspectRatio}`);
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

    createPlayer(): ShakaPlayer {
        const player = new ShakaPlayer()
        this.player = player
        return player
    }

    // Метод для инициализации видеопотока
    initializeVideoStream(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!this.stream) reject("Doesn't have stream url"); // Проверка наличия URL потока
            if (!ShakaPlayer.isBrowserSupported())
                return reject("Browser does not support Shaka Player"); // Проверка поддержки Shaka Player
            const player = this.player || this.createPlayer(); // Создание нового инстанса ShakaPlayer

            player.configure({
                streaming: {
                    retryParameters: {
                        timeout: 30000,
                        stallTimeout: 5000,
                        connectionTimeout: 10000,
                        maxAttempts: 5,
                        baseDelay: 1000,
                        backoffFactor: 2,
                        fuzzFactor: 0.5,
                    },
                    bufferBehind: 60,
                    // Обработчик ошибок потока
                    failureCallback: (e: any) => {
                        console.log(`${this.stream} stream fall ${e.code}`); // Вывод сообщения о сбое потока
                        if (e.severity === 2) {
                            // Повторная загрузка видео с задержкой 10 секунд
                            setTimeout(() => this.initializeVideoStream(), 1000 * 10);
                        }
                    },
                },
            });
            player.attach(this.videoElement);
            player
                .load(this.stream)
                .then(() => this.autoplay && resolve(this.play()))
                .catch((err: any) => reject(err));
        })
    }

    // Метод для удаления плеера
    onDestroy(): void {
        this.player?.destroy()
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
        this.setPreview()
    };

    // Метод для генерации потока видео
    generateStream = (from?: number, length?: number): void => {
        const {url, hlsMode, token} = this.camera;
        const time = from && length ? `-${from}-${length}` : "";
        this.stream =
            hlsMode === "fmp4"
                ? `${url}/index${time}.fmp4.m3u8?token=${token}`
                : `${url}/index${time}.m3u8?token=${token}`;
        if (this.autoplay)
            this.play();
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
            const _preview: string | undefined = jsonData["URL"]
            if (_preview) {
                axios.head(_preview).then((response) => {
                    if (response.status === 200) {
                        this.preview = _preview;
                        this.setPreview()
                    }
                })
            }
        });
    };

    // Метод для генерации потока видео
    generateStream = (from?: number): void => {
        const urlBase = new URL(this.getForpostFormat(from));
        const postParams = new URLSearchParams(urlBase.searchParams);
        urlBase.search = "";
        const _url = urlBase.href;
        axios.post(_url, postParams.toString()).then((response) => {
            const jsonData = response.data;
            this.stream = jsonData["URL"] || "empty";
            if (this.autoplay)
                this.play();
        }).catch(() => {
            console.log("Не удалось загрузить поток", _url, postParams.toString())
            this.player.detach()
        })
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
        this.setPreview()
    };

    // Метод для генерации потока видео
    generateStream = (from?: number, length?: number): void => {
        const {url, token} = this.camera;
        if (from && length) {
            this.stream = `${url}/playlist_dvr_range-${from}-${length}.m3u8?wmsAuthSign=${token}`;
        } else {
            this.stream = `${url}/playlist.m3u8?wmsAuthSign=${token}`;
        }
        if (this.autoplay)
            this.play();
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
        this.setPreview()
    };

    // Метод для генерации потока видео
    generateStream = (from?: number, length?: number): void => {
        const DATE_FORMAT: string = 'DD.MM.YYYY HH:mm:ss'
        const {url, token} = this.camera;
        let parameters = ""
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
            if (this.autoplay)
                this.play();
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