import { response } from "."

export interface Camera {
    houseId: number;
    id: number;
    name: string;
    lat: number;
    lon: number;
    serverType:string;
    hlsMode:string;
    url: string;
    token: string;
}

export const getCameras = async (houseId: number) => {
    const body = JSON.stringify({ houseId })
    const res = await response({ path: 'cctv/all', body })

    return res.data.data as Camera[]
}