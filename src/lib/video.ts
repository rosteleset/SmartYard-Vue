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
  streamUrl: string, // URL потока
  videoElement: HTMLVideoElement, // HTML элемент видео
  _player?: Player // Параметр для передачи объекта Player, необязательный
): Promise<Player | undefined> => {
  // Вспомогательная функция для загрузки видео
  const loader = (player: Player): Promise<void> => {
    return new Promise((resolve) => {
      player
        .load(streamUrl) // Загрузка видео по указанному URL
        .then(() => {
          console.log("Video loaded"); // Вывод сообщения об успешной загрузке видео
          resolve();
        })
        .catch((err) => {
          console.error("Error loading video", err); // Вывод сообщения об ошибке загрузки видео
          resolve();
        });
    });
  };

  return new Promise((resolve, reject) => {
    // Проверка поддержки браузером Shaka Player
    if (Player.isBrowserSupported()) {
      const player = _player || new Player(); // Создание нового объекта Player или использование переданного
      player.configure({
        streaming: {
          retryParameters: {
            timeout: 30000,
            stallTimeout: 5000,
            connectionTimeout: 10000,
            maxAttempts: 2,
            baseDelay: 1000,
            backoffFactor: 2,
            fuzzFactor: 0.5,
          },
          bufferBehind: 60,
          // Обработчик ошибок потока
          failureCallback: (e: any) => {
            console.log(`stream fall ${e.code}`); // Вывод сообщения о сбое потока
            if (e.severity === 2) loader(player); // Повторная загрузка видео
          },
        },
      });
      player.attach(videoElement); // Привязка видео к HTML элементу
      loader(player).then(() => resolve(player)); // Загрузка видео и возврат объекта Player
    } else {
      console.error("Browser does not support Shaka Player"); // Вывод сообщения о неподдержке браузером Shaka Player
      reject(undefined);
    }
  });
};

export { getLiveURL, getPreviewURL, initializeVideoStream };
