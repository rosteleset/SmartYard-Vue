import { Player } from "shaka-player/dist/shaka-player.compiled";
import { Camera } from "../types/camera";

// Функция для получения URL прямого эфира
const getLiveURL = (camera: Camera, from?: number, length?: number) => {
  const { serverType, url, hlsMode, token } = camera;
  if (!token) return "";
  const speed = 1;
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
      const speedStr = speed < 1 ? speed.toFixed(2) : speed.toFixed(0);
      const tz = new Date().getTimezoneOffset() * 60;
      const parameters = `&TS=${from}&TZ=${tz}&Speed=${speedStr}`;
      let urlBase = new URL(camera.url + parameters);
      if (!urlBase || !urlBase.searchParams) {
        console.log(camera.url);
        return "";
      }
      return urlBase.toString();
    default:
      return "";
  }
};

// Функция для получения URL превью
const getPreviewURL = (camera: Camera) => {
  const { serverType, url, token } = camera;
  switch (serverType) {
    case "flussonic":
      return `${url}/preview.mp4?token=${token}`;
    case "forpost":
      const urlBase = new URL(camera.url);

      urlBase.searchParams.delete("Format");
      urlBase.searchParams.append("Format", "JPG");

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
  const maxRetries = 3;
  let retryCount = 0;
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
    if (!streamUrl) reject();
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

            // if (e.severity === 2) loader(player); // Повторная загрузка видео
          },
        },
      });
      player.attach(videoElement); // Привязка видео к HTML элементу
      loader(player)
        .then(() => resolve(player)) // Загрузка видео и возврат объекта Player
        .catch((err) => reject(err));
    } else {
      console.error("Browser does not support Shaka Player"); // Вывод сообщения о неподдержке браузером Shaka Player
      reject("Browser does not support Shaka Player");
    }
  });
};

export { getLiveURL, getPreviewURL, initializeVideoStream };
