# Smartyard Web

Smartyard Web - это веб-версия приложения "Теледом"

### Главный экран 
![screenshot_1](/screenshots/screenshot_1.png?raw=true)
![screenshot_1](/screenshots/screenshot_2.png?raw=true)
### Камеры 
![screenshot_1](/screenshots/screenshot_3.png?raw=true)
![screenshot_1](/screenshots/screenshot_4.png?raw=true)

## Содержание
- [Установка](#установка)
- [Использование](#использование)
- [Скрипты](#скрипты)
- [Переменные окружения](#переменные-окружения)
- [Зависимости](#зависимости)
- [Dev Зависимости](#dev-зависимости)
- [Лицензия](#лицензия)

## Установка

Чтобы установить Smartyard Web, выполните следующие шаги:

1. Склонируйте репозиторий:

   ```
   https://github.com/rosteleset/SmartYard-Vue.git
   ```

2. Перейдите в директорию проекта:

   ```
   cd SmartYard-Web
   ```

3. Установите зависимости, используя npm или yarn:

   ```
   npm install
   ```

   или
   
   ```
   yarn
   ```

## Использование

После установки вы можете запустить сервер разработки, выполнив:

```
npm run dev
```


Это запустит сервер разработки, предоставленный Vite.

## Разворачивание на сервере

### 1. Сборка проекта

Для подготовки сборки выполните команду:

```
npm run build
```

После этого в папке `dist` появится готовая версия приложения для продакшена.

### 2. Загрузка файлов на сервер

Скопируйте содержимое папки `dist` на ваш сервер. Например, с помощью `scp`:

```
scp -r dist/* user@your_server:/var/www/smartyard
```

#### 3. Настройка Nginx

Пример конфигурации для домена:

```
server {
    listen 80;
    server_name your_domain.com;

    root /var/www/smartyard;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}

```
Если приложение разворачивается в поддиректории,  используйте переменную окружения `VITE_BASE_PATH`.

Пример конфигурации для вложенной директории:

```
location /smart {
    root /var/www;
    try_files $uri $uri/ /smart/index.html;
}
```

## Скрипты

Smartyard Web поставляется с несколькими полезными скриптами:

- `dev`: Запускает сервер разработки.
- `build`: Собирает проект для продакшена.
- `preview`: Предварительный просмотр собранного проекта локально.
- `test`: Запускает тесты.

Вы можете запускать эти скрипты с помощью npm или yarn. Например:

```
npm run dev
```

## Переменные окружения

Для конфигурации проекта используются переменные окружения, которые хранятся в файле default.env. В этом файле определены следующие переменные:
- `VITE_BASE_PATH`: Базовый путь, который используется для префикса всех маршрутов. 
- `VITE_SERVER_URL`: URL сервера для выполнения API запросов.
- `VITE_TMP_TOKEN`: Временный токен для аутентификации.
- `VITE_CRS`: Система координат.
- `VITE_DEFAULT_LOCALE`: Язык по умолчанию для приложения.
- `VITE_AUTH_TYPE` : Тип авторизации (`outgoingCall`, `sms` или `token`)
- `VITE_DEV_PROXY_TARGET`: полный url для проксирования запросов в dev моде 
- `VITE_DEV_PROXY_PREFIX`: префикс для проксирования запросов в dev моде

Чтобы настроить переменные окружения для вашего проекта, выполните следующие шаги:

1. Скопируйте файл default.env и переименуйте его в .env, используя следующую команду:

    ```
    cp default.env .env
    ```

    В Windows команда будет выглядеть так:

    ```
    copy default.env .env
    ```

2. Заполните переменные окружения в файле .env значениями, соответствующими вашей среде разработки.

## Зависимости

Smartyard Web использует следующие зависимости:

- `@vue-leaflet/vue-leaflet`: Интеграция Leaflet для Vue.js.
- `@vuepic/vue-datepicker`: Компонент выбора даты, для отображения календаря с доступными записями.
- `@vueuse/core`: Vue.js хуки и функции.
- `axios`: HTTP-клиент для выполнения запросов.
- `dayjs`: Библиотека для манипуляции с датами. Добавляет поддержку мультиязычности дат.
- `rbt-player`: Плеер Shaka для потокового воспроизведения видео.
- `leaflet`: Библиотека Leaflet, для отображения карт.
- `pinia`: Управление состоянием для Vue.js.
- `sass`: Компилятор Sass.
- `vue`: Фреймворк Vue.js.
- `vue-i18n`: Плагин для интернационализации Vue.js.
- `vue-router`: Маршрутизатор Vue.js.

## Dev Зависимости

Проект использует следующие dev зависимости:

- `@chromatic-com/storybook`: Инструмент для разработки UI компонентов.
- `@pinia/testing`: Утилиты для тестирования Pinia.
- `@storybook/addon-essentials`: Основные дополнения для Storybook.
- `@storybook/addon-interactions`: Дополнение для добавления действий в Storybook.
- `@storybook/addon-links`: Дополнение для добавления ссылок в Storybook.
- `@storybook/blocks`: Готовые блоки для Storybook.
- `@storybook/test`: Инструменты для тестирования компонентов в Storybook.
- `@storybook/vue3`: Поддержка Vue.js 3 для Storybook.
- `@storybook/vue3-vite`: Плагин для поддержки Vue.js 3 в Vite для Storybook.
- `@types/leaflet`: Типы TypeScript для Leaflet.
- `@types/node`: Типы TypeScript для Node.js.
- `@vitejs/plugin-vue`: Плагин Vue.js для Vite.
- `@vitest/ui`: Интерфейс пользователя для Vitest.
- `@vue/test-utils`: Утилиты для тестирования Vue.js компонентов.
- `happy-dom`: Модуль для симуляции DOM для тестирования.
- `storybook`: Инструмент для разработки и тестирования компонентов.
- `storybook-addon-mock`: Дополнение для мокирования данных в Storybook.
- `typescript`: Компилятор TypeScript.
- `vite`: Инструмент сборки для современной веб-разработки.
- `vite-plugin-env-compatible`: Плагин переменных окружения для Vite.
- `vite-svg-loader`: Загрузчик SVG для Vite.
- `vitest`: Инструмент для тестирования Vue.js.

## Лицензия

Данный проект опубликован под стандартной общественной лицензией [GNU GPLv3](LICENSE).