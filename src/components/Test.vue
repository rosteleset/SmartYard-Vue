<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';

const face = ref({
    left: 508,
    top: 478,
    width: 153,
    height: 180
});

const containerRef = ref<HTMLDivElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);

const imageUrl = ref('https://rbt-demo.lanta.me/mobile/address/plogCamshot/10001000-65ca-0481-a848-ec462c032574');
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
    const containerHeight = container.clientHeight;

    const imgAspectRatio = img.naturalWidth / img.naturalHeight;
    const containerAspectRatio = containerWidth / containerHeight;

    let newWidth, newHeight;
    if (imgAspectRatio > containerAspectRatio) {
        newWidth = containerWidth;
        newHeight = newWidth / imgAspectRatio;
    } else {
        newHeight = containerHeight;
        newWidth = newHeight * imgAspectRatio;
    }

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
    const scaledFace = {
        left: face.value.left * scaleX,
        top: face.value.top * scaleY,
        width: face.value.width * scaleX,
        height: face.value.height * scaleY
    };

    ctx.beginPath();
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 3;
    ctx.strokeRect(scaledFace.left, scaledFace.top, scaledFace.width, scaledFace.height);
    ctx.closePath();
};

onMounted(() => {
    img.onload = () => {
        updateCanvasSize();
    };
    img.src = imageUrl.value;

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

