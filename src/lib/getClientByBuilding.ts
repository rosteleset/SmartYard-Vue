import { computed } from "vue"
import { useUserStore } from "../store/user"
import { Building } from "../types/building"

const getClientByBuilding = (building: Building) => {
    const userStore = useUserStore()

    const settings = computed(() => userStore.clients.find(s => s.houseId === building.houseId))

    return settings
}

export default getClientByBuilding