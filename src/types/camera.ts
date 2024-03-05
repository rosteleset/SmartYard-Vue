export interface Camera {
  houseId: number;
  id: number;
  name: string;
  lat: number;
  lon: number;
  serverType: string;
  hlsMode: string;
  url: string;
  token: string;
}

interface Range {
  from: number;
  duration: number;
}

export interface Ranges {
  stream: string;
  ranges: Range[];
}
