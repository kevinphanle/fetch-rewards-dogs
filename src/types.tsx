export interface Dog {
  id: string;
  breed: string;
  img: string;
  name: string;
  age: number;
  zip_code: string;
}

export interface Location {
  zip_code: string;
  latitude: number;
  longitude: number;
  city: string;
  state: string;
  county: string;
}

export interface Coordinates {
  lat: number;
  lon: number;
}

export type SortDirection = "asc" | "desc";
