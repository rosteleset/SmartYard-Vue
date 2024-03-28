<script setup lang="ts">
import { LIcon, LMap, LMarker, LTileLayer } from "@vue-leaflet/vue-leaflet";
import { LatLngBoundsExpression, Map, Point, PointExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import { StyleValue, ref } from "vue";
import cameraIcon from "@/assets/camera.svg?component";
import { Camera } from "@/types/camera";
import VideoModal from "@/components/VideoModal.vue";

// Определение свойств компонента
const props = defineProps<{
  cameras: Camera[];
}>();

// Реактивные переменные
const zoom = ref(10);
const map = ref<Map | null>(null);
const openCamera = ref<Camera | null>(null);
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
  openCamera.value = camera;
};
</script>

<template>
  <div v-if="cameras.length>0" class="map">
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
        :latLng="[Number(camera.lat), Number(camera.lon)]"
        :name="'test'"
        @click="handler($event, camera)"
      >
        <LIcon
          :ref="`camera_${camera.id}`"
          className="map-icon__container"
          :iconSize="[45, 45]"
        >
          <cameraIcon class="map-icon__icon"/>
          <div class="map-icon__label">{{ getCameraIndex(camera) }}</div>
        </LIcon>
      </LMarker>
    </LMap>
    <!-- Модальное окно с видеопотоком -->
    <VideoModal
      v-if="openCamera"
      :camera="openCamera"
      @on-close="openCamera = null"
    />
  </div>
</template>

<style lang="scss">
@use "@/style/variables" as *;
.map {
  height: 500px;
  padding: 24px;
  z-index: 10;
  .map-icon {
    &__container {
      box-sizing: border-box;
      background-color: #ffffff;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      padding: 5px;
    }
    &__icon {
      flex: 1;
      grid-area: icon;
      // width: 20px !important;
      path {
        fill: $darkBlue;
      }
    }
    &__label {
      grid-area: label;
      color: #298bff;
      line-height: 1;
      font-size: 12px;
      text-align: center;
    }
  }
}
</style>
