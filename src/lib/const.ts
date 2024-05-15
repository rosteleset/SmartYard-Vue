// Получение URL сервера и временного токена из окружения
export const SERVER_URL =
    import.meta.env.VITE_DEV_PROXY_PREFIX &&
    !import.meta.env.VITE_SERVER_URL.includes("http")
        ? import.meta.env.VITE_DEV_PROXY_PREFIX + import.meta.env.VITE_SERVER_URL
        : import.meta.env.VITE_SERVER_URL;