<script setup lang="ts">
import {
  LatLngExpression,
  Layer,
  Map,
  divIcon,
  layerGroup,
  marker,
  tileLayer,
} from "leaflet";
import "leaflet/dist/leaflet.css";
import { computed, onMounted, ref, watch } from "vue";
import cameraIcon from "../assets/camera.svg";

import { Camera } from "../types/camera";

const { cameras } = defineProps<{ cameras: Camera[] }>();

const mapElement = ref<HTMLDivElement | null>(null);
const map = ref<Map>();
const points = computed(() => cameras);
const initMap = () => {
  if (!mapElement.value) return null;
  const _map = new Map(mapElement.value, { attributionControl: false }).setView(
    [52.770935, 41.404545],
    13
  ); // Установка центра карты и масштаба

  tileLayer("https://tile.lanta.me/osm/{z}/{x}/{y}.png", {}).addTo(_map);

  map.value = _map;
};

// Функция для создания маркера с иконкой и текстом внутри круга
const createCustomMarker = (cords: LatLngExpression, text: string) => {
  const icon = divIcon({
    iconSize: [40, 40],
    className: "map-icon__container",
    html: `
        <img src="${cameraIcon}" class="map-icon__icon" />
        <div class="map-icon__label">${text}</div>
        `,
  });
  return marker(cords, { icon });
};

onMounted(() => {
  initMap();
});

watch([cameras, map], () => {
  console.log(cameras);
  
  if (map.value)
    for (const point of cameras) {
      createCustomMarker(
        { lat: point.lat, lng: point.lon },
        point.id.toString()
      ).addTo(map.value);
    }
});
</script>

<template>
  <div id="map" ref="mapElement"></div>
</template>

<style lang="scss">
#map {
  height: 500px;

  .map-icon {
    &__container {
      box-sizing: border-box;
      background-color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      border-radius: 50%;
      padding: 10px;
    }

    &__icon {
      width: 20px;
      align-self: flex-start;
    }
    &__label {
      color: #298bff;
      align-self: flex-end;
    }
  }
}
</style>
