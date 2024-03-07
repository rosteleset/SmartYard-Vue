<script setup lang="ts">
import { LIcon, LMap, LMarker, LTileLayer } from "@vue-leaflet/vue-leaflet";
import { LatLngBoundsExpression, Map, Point, PointExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import { StyleValue, defineProps, ref } from "vue";
import cameraIcon from "../assets/camera.svg";
import { Camera } from "../types/camera";
import VideoModal from "./VideoModal.vue";

// Определение свойств компонента
const props = defineProps<{
  cameras: Camera[];
}>();

// Реактивные переменные
const zoom = ref(10);
const map = ref<Map | null>(null);
const openCamera = ref<number | null>(null);
const styles = ref<StyleValue>();
const TILE_SERVER = import.meta.env.VITE_TILE_SERVER;
const CRS = import.meta.env.VITE_CRS;

// Функция для определения индекса камеры в массиве
const getCameraIndex = (camera: Camera): number => {
  return props.cameras.findIndex((c) => c.id === camera.id) + 1;
};

// Функция для определения центра карты
const getCenter = (): PointExpression => {
  const length = props.cameras.length;
  const sum = props.cameras.reduce(
    (prev, camera) => [
      Number(camera.lat) + prev[0],
      Number(camera.lon) + prev[1],
    ],
    [0, 0]
  );
  return [sum[0] / length, sum[1] / length];
};

// Обработчик события ready карты
const onReady = (e: Map) => {
  const bounds: LatLngBoundsExpression = props.cameras.map((camera) => [
    Number(camera.lat),
    Number(camera.lon),
  ]);
  const padding = new Point(50, 50);
  const _zoom = e.getBoundsZoom(bounds, false, padding);
  zoom.value = _zoom;
};

// Обработчик события клика на маркере камеры
const handler = (event: any, camera: Camera) => {
  if (event.target) {
    const rect = event.target._icon.getBoundingClientRect();
    styles.value = {
      top: `${rect?.top}px`,
      left: `${rect?.left}px`,
      width: `${rect?.width}px`,
      height: `${rect?.height}px`,
    };
  }
  openCamera.value = camera.id;
};
</script>

<template>
  <div class="map">
    <LMap
      ref="map"
      v-model:zoom="zoom"
      :center="getCenter()"
      :useGlobalLeaflet="false"
      :options="{ attributionControl: false }"
      :crs="CRS"
      style="z-index: 10"
      @ready="onReady"
    >
      <LTileLayer :url="TILE_SERVER" />
      <LMarker
        v-for="camera in cameras"
        :key="camera.id"
        :latLng="[camera.lat, camera.lon]"
        :name="'test'"
        @click="handler($event, camera)"
      >
        <LIcon
          :ref="`camera_${camera.id}`"
          className="map-icon__container"
          :iconSize="[45, 45]"
        >
          <img class="map-icon__icon" :src="cameraIcon" alt="" />
          <div class="map-icon__label">{{ getCameraIndex(camera) }}</div>
        </LIcon>
      </LMarker>
    </LMap>
    <!-- Модальное окно с видеопотоком -->
    <VideoModal
      v-for="camera in cameras"
      :key="camera.id"
      :camera="camera"
      :startStyles="styles"
      :isOpen="openCamera === camera.id"
      @on-close="openCamera = null"
    />
  </div>
</template>

<style lang="scss">
.map {
  height: 500px;
  padding: 24px;
  z-index: 10;
  .map-icon {
    &__container {
      box-sizing: border-box;
      background-color: #ffffff;
      display: grid;
      grid-template-areas: "icon ." ". label";
      grid-template-columns: repeat(2, 1fr);
      grid-template-rows: repeat(2, 1fr);
      border-radius: 50%;
      padding: 5px;
    }
    &__icon {
      grid-area: icon;
      display: block;
      width: 20px !important;
      align-self: flex-start;
    }
    &__label {
      grid-area: label;
      color: #298bff;
      align-self: flex-end;
      line-height: 1;
      font-size: 18px;
    }
  }
}
</style>
