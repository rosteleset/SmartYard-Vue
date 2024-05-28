function generateDeviceId() {
    const navigator_info = window.navigator;
    const screen_info = window.screen;
    const userAgent = navigator_info.userAgent;
    const platform = navigator_info.platform;
    const language = navigator_info.language;
    const screenWidth = screen_info.width;
    const screenHeight = screen_info.height;
    const colorDepth = screen_info.colorDepth;

    // Объединяем параметры в одну строку
    const data = `${userAgent}-${platform}-${language}-${screenWidth}x${screenHeight}-${colorDepth}`;

    return BigInt(data.replace(/\D+/g, '')).toString(16)
}

export default generateDeviceId