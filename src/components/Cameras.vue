<script setup lang="ts">
import { inject, ref } from "vue";
import cameraIcon from "../assets/camera.svg";
import { useCameras } from "../hooks/cameras";
import Label from "./Label.vue";
import Map from "./Map.vue";
import Video from "./Video.vue";
import { useRoute } from "vue-router";
import { useAdressesStore } from "../store/addresses";

const {} = defineProps<{
  compact?: boolean;
}>();

const route = useRoute();
const houseId: string | undefined =
  typeof route.params.houseId === "string"
    ? route.params.houseId
    : inject<string>("houseId") || undefined;

const { getAdressByHouseId } = useAdressesStore();

const invalidHouseId =
  typeof route.params.houseId === "string" &&
  getAdressByHouseId(route.params.houseId) === undefined; //проверка на наличие дома если в роутрере указан houseId
const isOpen = ref(false);

const { cameras } = useCameras({ houseId, overview: houseId === undefined });

const handleToggle = (open: boolean) => {
  isOpen.value = open;
};
</script>

<template>
  <template v-if="!invalidHouseId">
    <Label
      v-if="compact"
      :icon="cameraIcon"
      alt="camera icon"
      :text="$t('addresses.cameras')"
      @toggle="handleToggle"
    />
    <div class="cameras__list" v-if="isOpen || !compact">
      <Video
        v-for="camera in cameras"
        :key="camera.id"
        :camera="camera"
        :index="cameras.indexOf(camera) + 1"
      />
    </div>
    <Map v-if="isOpen || !compact" :cameras="cameras" />
  </template>
  <template v-else>
    <div class="global-error">404</div>
  </template>
</template>

<style scoped lang="scss">
.cameras {
  &__list {
    padding: 24px;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;

    @media (max-width: 1024px) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: 480px) {
      grid-template-columns: repeat(1, 1fr);
    }
  }
}
</style>
