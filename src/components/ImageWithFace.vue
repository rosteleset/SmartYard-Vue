<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { EventFaceCoordinates } from '../types/events';

const { imageUrl, face, color } = defineProps<{ imageUrl: string, face?: EventFaceCoordinates, color: string }>()

const containerRef = ref<HTMLDivElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);

const img = new Image();

const updateCanvasSize = () => {
    const container = containerRef.value;
    const canvas = canvasRef.value;
    if (!canvas || !container)
        return
    const ctx = canvas.getContext('2d');
    if (!ctx)
        return

    const containerWidth = container.clientWidth;

    const imgAspectRatio = img.naturalWidth / img.naturalHeight;

    let newWidth, newHeight;
    newWidth = containerWidth;
    newHeight = newWidth / imgAspectRatio;

    canvas.width = newWidth;
    canvas.height = newHeight;

    drawCanvas(ctx);
};

const drawCanvas = (ctx: CanvasRenderingContext2D) => {
    if (!img.complete) return;

    const scaleX = ctx.canvas.width / img.naturalWidth;
    const scaleY = ctx.canvas.height / img.naturalHeight;

    ctx.drawImage(img, 0, 0, ctx.canvas.width, ctx.canvas.height);
    drawFaceRectangle(ctx, scaleX, scaleY);
};

const drawFaceRectangle = (ctx: CanvasRenderingContext2D, scaleX: number, scaleY: number) => {
    if (!face)
        return
    const scaledFace = {
        left: face.left * scaleX,
        top: face.top * scaleY,
        width: face.width * scaleX,
        height: face.height * scaleY
    };

    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.strokeRect(scaledFace.left, scaledFace.top, scaledFace.width, scaledFace.height);
    ctx.closePath();
};

onMounted(() => {
    img.onload = () => {
        updateCanvasSize();
    };
    img.src = imageUrl;

    window.addEventListener('resize', updateCanvasSize);
    updateCanvasSize();
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', updateCanvasSize);
});
</script>
  
<template>
    <div ref="containerRef">
        <canvas ref="canvasRef"></canvas>
    </div>
</template>

<style scoped lang="scss">
.container {
    width: 100%;
}
</style>