import { useUserStore } from "../store/user"
import { Building } from "../types/building"
import { Settings } from "../types/user"

const getSettingsByBuilding = (building: Building): Settings | undefined => {
    const userStore = useUserStore()
    
    if (userStore.settings.length > 0)
        return userStore.settings.find(s => s.houseId === building.houseId)
}

export default getSettingsByBuilding