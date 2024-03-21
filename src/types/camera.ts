export interface Camera {
  houseId?: number;
  id: number;
  name: string;
  lat: number;
  lon: number;
  serverType: string;
  hlsMode?: string;
  url: string;
  token: string;
}

export interface Range {
  from: number;
  duration: number;
}

export interface Stream {
  stream: string;
  ranges: Range[];
}

export interface FormatedRange extends Range {
  date: Date;
  streamUrl: string;
}