<script setup lang="ts">
import {onMounted, ref, watch} from "vue";
import {toCanvas} from "qrcode";

const {text} = defineProps<{ text: string }>();

const qrCodeCanvas = ref<HTMLCanvasElement | null>(null); // Ссылка на холст QR-кода

// Функция для генерации QR-кода
const generateQRCode = () => {
  if (text && qrCodeCanvas.value) {
    toCanvas(qrCodeCanvas.value, `${text}`, {width: 256}, (error) => {
      if (error) console.error(error);
    });
  }
};

onMounted(generateQRCode)
watch(qrCodeCanvas, generateQRCode)
</script>

<template>
  <canvas ref="qrCodeCanvas"></canvas>
</template>

<style scoped lang="scss">

</style>