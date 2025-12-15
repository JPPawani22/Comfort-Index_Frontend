export interface Weather {
  cityId: number;
  cityName: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  description: string;
  icon: string;
  timestamp: Date;
  comfortIndex?:  ComfortIndex;
}

export interface ComfortIndex {
  score: number;
  category: 'Excellent' | 'Good' | 'Moderate' | 'Poor' | 'Very Poor';
  factors: {
    temperature: number;
    humidity: number;
    windSpeed: number;
  };
  recommendations: string[];
}