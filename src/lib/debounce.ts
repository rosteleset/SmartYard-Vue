// Функция debounce принимает функцию func и задержку delay
// и возвращает новую функцию, которая вызывает func через delay миллисекунд
export default function debounce(func: (...args: any[]) => void, delay: number): (...args: any[]) => void {
    let timeoutId: number | null = null;

    return (...args: any[]) => {
        if (timeoutId !== null) {
            // Если timeoutId не равен null, очищаем предыдущий таймер
            clearTimeout(timeoutId);
        }

        // Устанавливаем новый таймер для вызова функции func через delay миллисекунд
        timeoutId = window.setTimeout(() => func(...args), delay);
    };
}