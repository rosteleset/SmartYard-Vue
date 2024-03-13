<script setup lang="ts">
import { ref } from "vue";
import { useRoute } from "vue-router";
import cameraIcon from "../assets/camera.svg";
import { useCameras } from "../hooks/cameras";
import { useAddressesStore } from "../store/addresses";
import Label from "./Label.vue";
import Map from "./Map.vue";
import Video from "./Video.vue";

const { houseId } = defineProps<{
  houseId?: string;
  compact?: boolean;
}>();

const route = useRoute();

const { getAddressByHouseId } = useAddressesStore();

const invalidHouseId =
  typeof route.params.houseId === "string" &&
  getAddressByHouseId(route.params.houseId) === undefined; //проверка на наличие дома если в роутрере указан houseId
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

.cameras-enter-active,
.cameras-leave-active {
  transition: 0.5s ease;
}
.cameras-enter-from,
.cameras-leave-to {
  opacity: 0;
}
</style>
