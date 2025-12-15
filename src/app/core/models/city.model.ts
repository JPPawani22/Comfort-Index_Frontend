export interface City {
  id: number;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
}

export interface CityResponse {
  cities: City[];
  total: number;
}