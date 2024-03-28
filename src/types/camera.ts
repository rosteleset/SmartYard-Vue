export interface Camera {
  houseId?: number;
  id: number;
  name: string;
  lat: string;
  lon: string;
  serverType: string;
  hlsMode?: string;
  hasSound?:boolean;
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