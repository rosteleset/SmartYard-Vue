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

  const handleScroll = (event: WheelEvent) => {
    if (!videoElement.value) return;
    
    const STEP = 0.2;
    // Определяем направление скролла
    const delta = Math.max(-1, Math.min(1, event.deltaY));

    // Получаем позицию курсора относительно элемента видео
    const rect = videoElement.value.getBoundingClientRect();
    offsetX.value = ((event.clientX - rect.left) / rect.width) * 100;
    offsetY.value = ((event.clientY - rect.top) / rect.height) * 100;
    // Изменяем масштаб в зависимости от направления скролла
    if (delta < 0) {
      scale.value += STEP; // Увеличиваем масштаб
    } else if (scale.value > 1) scale.value -= STEP; // Уменьшаем масштаб
  };

  watch(videoElement, (value, prev) => {
    if (value) value.addEventListener("wheel", handleScroll);
    if (prev) prev.removeEventListener("wheel", handleScroll);
  });
  onUnmounted(() => {
    videoElement.value?.removeEventListener("wheel", handleScroll);
  });

  return {
    scale,
    videoStyles,
  };
};

export default useZoom;
