<script setup lang="ts">
import useCameras from "@/hooks/useCameras";
import {useAddressesStore} from "@/store/addresses";
import Map from "@/components/Map.vue";
import CamerasList from "@/components/CamerasList.vue";
import NotFound from "@/components/NotFound.vue";

const {houseId, overview} = defineProps<{
  houseId?: string;
  overview?: boolean;
}>();

const {getAddressByHouseId} = useAddressesStore();

const invalidHouseId = houseId && getAddressByHouseId(houseId) === undefined; //проверка на наличие дома если в роутрере указан houseId

const {cameras} = useCameras({houseId, overview: overview});


</script>

<template>
  <template v-if="!invalidHouseId">

    <CamerasList :cameras="cameras"/>
    <Map :cameras="cameras"/>

  </template>
  <template v-else>
    <NotFound/>
  </template>
</template>

<style scoped lang="scss">

</style>
