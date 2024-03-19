import { Player } from "shaka-player/dist/shaka-player.compiled";
import { Camera } from "../types/camera";
import axios from "axios";

const getForpostFormat = (camera: Camera, from?: number) => {
  const url = camera.url;
  const speed = 1;
  const speedStr = speed < 1 ? speed.toFixed(2) : speed.toFixed(0);
  const tz = new Date().getTimezoneOffset() * 60;
  const parameters = from ? `&TS=${from}&TZ=${tz}&Speed=${speedStr}` : "";
  let urlBase = new URL(url + parameters + `&${camera.token}`);
  if (!urlBase || !urlBase.searchParams) {
    return "empty";
  }
  return urlBase.toString();
};

// Функция для получения URL прямого эфира
const getLiveURL = (camera: Camera, from?: number, length?: number) => {
  const { serverType, url, hlsMode, token } = camera;
  if (!token) return "empty";

  let time = "";
  if (from && length) time = `-${from}-${length}`;
  switch (serverType) {
    case "nimble":
      return `${url}/playlist.m3u8?wmsAuthSign=${token}`;
    case "flussonic":
      return hlsMode === "fmp4"
        ? `${url}/index${time}.fmp4.m3u8?token=${token}`
        : `${url}/index${time}.m3u8?token=${token}`;
    case "forpost":
      return getForpostFormat(camera, from);
    default:
      return "empty";
  }
};

// Функция для получения URL превью
const getPreviewURL = async (camera: Camera) => {
  const { serverType, url, token } = camera;
  switch (serverType) {
    case "flussonic":
      return `${url}/preview.mp4?token=${token}`;
    case "forpost":
      const urlBase = new URL(getForpostFormat(camera));

      urlBase.searchParams.delete("Format");
      urlBase.searchParams.append("Format", "JPG");

      const postParams: { [key: string]: any } = {};
      urlBase.searchParams.forEach((value, key) => (postParams[key] = value));
      urlBase.search = "";
      const _url = urlBase.href.replace("https://fpst.garant.tv", "/fpst")


      try {
        const response = await axios.post(
          _url,
          JSON.stringify(postParams)
        );
        console.log(response);
        
        const jsonData = response.data;

        const streamURL: string = jsonData["URL"] || "empty";
        return streamURL;
      } catch (error) {
        console.log(error);

        return "empty";
      }

      return urlBase.toString();

    default:
      return "";
  }
};

// Функция для инициализации видеопотока
const initializeVideoStream = (
  streamUrl: string, // URL потока
  videoElement: HTMLVideoElement, // HTML элемент видео
  _player?: Player // Параметр для передачи объекта Player, необязательный
): Promise<Player> => {
  // Вспомогательная функция для загрузки видео
  const loader = (player: Player): Promise<void> => {
    return new Promise((resolve, reject) => {
      player
        .load(streamUrl) // Загрузка видео по указанному URL
        .then(() => {
          console.log("Video loaded"); // Вывод сообщения об успешной загрузке видео
          resolve();
        })
        .catch((err) => {
          reject(err);
        });
    });
  };

  return new Promise((resolve, reject) => {
    if (!streamUrl) reject(); // Проверка наличия URL потока

    // Проверка поддержки браузером Shaka Player
    if (Player.isBrowserSupported()) {
      const player = _player || new Player(); // Создание нового объекта Player или использование переданного
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
            console.log(`${streamUrl} stream fall ${e.code}`); // Вывод сообщения о сбое потока
            if (e.severity === 2) {
              // Повторная загрузка видео с задержкой 10 секунд
              setTimeout(() => loader(player), 1000 * 10);
            }
          },
        },
      });

      player.attach(videoElement); // Привязка видео к HTML элементу
      loader(player)
        .then(() => resolve(player)) // Загрузка видео и возврат объекта Player при успешном завершении
        .catch((err) => reject(err)); // Обработка ошибки загрузки видео
    } else {
      console.error("Browser does not support Shaka Player"); // Вывод сообщения о неподдержке браузером Shaka Player
      reject("Browser does not support Shaka Player");
    }
  });
};

export { getLiveURL, getPreviewURL, initializeVideoStream };
