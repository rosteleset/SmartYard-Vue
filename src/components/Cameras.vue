<script setup lang="ts">
import { computed, ref } from "vue";
import CameraIcon from "@/assets/camera.svg?component";
import useCameras from "@/hooks/useCameras";
import { useAddressesStore } from "@/store/addresses";
import Label from "@/components/Label.vue";
import Map from "@/components/Map.vue";
import Video from "@/components/Video.vue";
import { useConfigStore } from "@/store/config";

console.log(typeof CameraIcon);
const { houseId, overview } = defineProps<{
  houseId?: string;
  compact?: boolean;
  overview?: boolean;
}>();

const { config } = useConfigStore();
const { getAddressByHouseId } = useAddressesStore();

const columns = computed<number>(() => config["columnsCount"] || 4);
const invalidHouseId = houseId && getAddressByHouseId(houseId) === undefined; //проверка на наличие дома если в роутрере указан houseId
// Состояния открытости в компактном режиме
const isOpen = ref(false);

const { cameras } = useCameras({ houseId, overview: overview });

const handleToggle = (open: boolean) => {
  isOpen.value = open;
};
</script>

<template>
  <template v-if="!invalidHouseId">
    <Label
      v-if="compact"
      :icon="CameraIcon"
      :alt="$t('addresses.cameras')"
      :text="$t('addresses.cameras')"
      @toggle="handleToggle"
    />
    <Transition name="cameras">
      <div v-if="isOpen || !compact">
        <div class="cameras__list">
          <Video
            v-for="camera in cameras"
            :key="camera.id"
            :camera="camera"
            :index="cameras.indexOf(camera) + 1"
          />
        </div>
        <Map :cameras="cameras" />
      </div>
    </Transition>
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
    grid-template-columns: repeat(v-bind(columns), 1fr);
    gap: 12px;

    @media (max-width: 1024px) {
      grid-template-columns: repeat(v-bind(columns/2), 1fr);
    }

    @media (max-width: 480px) {
      grid-template-columns: repeat(v-bind(columns/4), 1fr);
    }
  }
}

.cameras-enter-active,
.cameras-leave-active {
  transition: 0.5s ease;
}
.cameras-enter-from,
.cameras-leave-to {
  opacity: 0;
}
</style>
