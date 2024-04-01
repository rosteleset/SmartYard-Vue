<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { EventFaceCoordinates } from "@/types/events";

// Определение пропсов
const { imageUrl, face, color } = defineProps<{
  imageUrl: string;
  face?: EventFaceCoordinates;
  color: string;
}>();

// Создание ссылок на элементы
const containerRef = ref<HTMLDivElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);
const img = new Image();
const error = ref(false);

// Функция для обновления размеров canvas
const updateCanvasSize = () => {
  const container = containerRef.value;
  const canvas = canvasRef.value;
  if (!canvas || !container) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const containerWidth = container.clientWidth;
  const imgAspectRatio = img.naturalWidth / img.naturalHeight;
  let newWidth, newHeight;
  newWidth = containerWidth;
  newHeight = newWidth / imgAspectRatio;
  canvas.width = newWidth;
  canvas.height = newHeight;
  drawCanvas(ctx);
};

// Функция для отрисовки изображения на canvas
const drawCanvas = (ctx: CanvasRenderingContext2D) => {
  if (!img.complete) return;

  const scaleX = ctx.canvas.width / img.naturalWidth;
  const scaleY = ctx.canvas.height / img.naturalHeight;
  ctx.drawImage(img, 0, 0, ctx.canvas.width, ctx.canvas.height);
  drawFaceRectangle(ctx, scaleX, scaleY);
};

// Функция для отрисовки прямоугольника лица на canvas
const drawFaceRectangle = (
  ctx: CanvasRenderingContext2D,
  scaleX: number,
  scaleY: number
) => {
  if (!face) return;

  const scaledFace = {
    left: Number(face.left) * scaleX,
    top: Number(face.top) * scaleY,
    width: Number(face.width) * scaleX,
    height: Number(face.height) * scaleY,
  };

  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.strokeRect(
    scaledFace.left,
    scaledFace.top,
    scaledFace.width,
    scaledFace.height
  );
  ctx.closePath();
};

// Отрисовка изображения и создание слушателя при монтировании компонента
onMounted(() => {
  img.onload = () => {
    updateCanvasSize();
  };
  img.onerror = () => error.value = true;

  img.src = imageUrl;
  window.addEventListener("resize", updateCanvasSize);
  updateCanvasSize();
});

// Удаление слушателя перед размонтированием компонента
onBeforeUnmount(() => {
  window.removeEventListener("resize", updateCanvasSize);
});
</script>
<template>
  <div ref="containerRef" class="cancas-container">
    <div v-if="error" class="error">{{ $t('events.image-error') }}</div>
    <canvas v-else ref="canvasRef"></canvas>
  </div>
</template>
<style scoped lang="scss">
.cancas-container {
  min-width: 40vw;
}
.error {
    text-align: center;
    padding: 24px;
}
</style>
