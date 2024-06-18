import {
    Ref,
    StyleValue,
    computed,
    onUnmounted,
    ref,
    watch
} from "vue";

const useZoom = (videoElement: Ref<HTMLVideoElement | null>) => {
    const scale = ref(1);
    const offsetX = ref(0);
    const offsetY = ref(0);
    const videoStyles = computed<StyleValue>(() => ({
        transformOrigin: `${offsetX.value}% ${offsetY.value}%`,
        transform: `scale(${scale.value})`,
    }));

    const dragX = ref(0);
    const dragY = ref(0);
    const onDrag = ref(false)

    const handleScroll = (event: WheelEvent) => {
        if (!videoElement.value) return;

        const STEP = 0.2;
        // Определяем направление скролла
        const delta = Math.max(-1, Math.min(1, event.deltaY));
        if (scale.value < 2) {
            // Получаем позицию курсора относительно элемента видео
            const rect = videoElement.value.getBoundingClientRect();
            offsetX.value = ((event.clientX - rect.left) / rect.width) * 100;
            offsetY.value = ((event.clientY - rect.top) / rect.height) * 100;
        }
        // Изменяем масштаб в зависимости от направления скролла
        if (delta < 0) {
            scale.value += STEP; // Увеличиваем масштаб
        } else if (scale.value > 1) scale.value -= STEP; // Уменьшаем масштаб
    };

    const startDrag = (event: MouseEvent) => {
        event.preventDefault();
        dragX.value = event.clientX;
        dragY.value = event.clientY;
        document.addEventListener("mousemove", drag);
        document.addEventListener("mouseup", stopDrag);
    }

    const stopDrag = (event: MouseEvent) => {
        event.preventDefault();
        setTimeout(() => {onDrag.value = false;},500)
        document.removeEventListener("mousemove", drag);
        document.removeEventListener("mouseup", stopDrag);
    }

    const drag = (event: MouseEvent) => {
        event.preventDefault();
         onDrag.value = true;
        if (!videoElement.value) return;

        const deltaX = event.clientX - dragX.value;
        const deltaY = event.clientY - dragY.value;

        // Применяем смещение к позиции offsetX и offsetY
        let _offsetX = offsetX.value - (deltaX / videoElement.value.offsetWidth) * 100 / scale.value;
        let _offsetY = offsetY.value - (deltaY / videoElement.value.offsetHeight) * 100 / scale.value;
        _offsetX = Math.max(0, Math.min(100, _offsetX))
        _offsetY = Math.max(0, Math.min(100, _offsetY))
        offsetX.value = _offsetX;
        offsetY.value = _offsetY;

        // Обновляем начальные координаты для следующего события drag
        dragX.value = event.clientX;
        dragY.value = event.clientY;
    }

    watch(videoElement, (value, prev) => {
        if (value) value.addEventListener("wheel", handleScroll);
        if (prev) prev.removeEventListener("wheel", handleScroll);

        value?.addEventListener("mousedown", startDrag);
    });

    onUnmounted(() => {
        videoElement.value?.removeEventListener("wheel", handleScroll);
    });

    return {
        scale,
        onDrag,
        videoStyles,
    };
};

export default useZoom;
