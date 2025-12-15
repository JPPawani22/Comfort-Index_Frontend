import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WeatherService } from '../../core/services/weather.service';
import { AuthService } from '../../core/services/auth.service';
import { City } from '../../core/models/city.model';
import { Weather } from '../../core/models/weather.model';
import { Header} from '../../shared/components/header/header';
import { WeatherCard } from '../weather/weather-card/weather-card';
import { CitySelector } from '../weather/city-selector/city-selector';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    CitySelector, 
    WeatherCard,
    Header
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class Dashboard implements OnInit {
  selectedCities: City[] = [];
  weatherData: Weather[] = [];
  loading = false;
  user$;

  constructor(
    private weatherService: WeatherService,
    private authService: AuthService
  ) {
    this.user$ = this.authService.getUser$();
  }

  ngOnInit(): void {
    // Load saved cities from localStorage
    const saved = localStorage.getItem('selectedCities');
    if (saved) {
      this.selectedCities = JSON.parse(saved);
      this.loadWeatherData();
    }
  }

  onCitySelected(city: City): void {
    if (! this.selectedCities.find(c => c.id === city. id)) {
      this.selectedCities.push(city);
      this.saveSelectedCities();
      this.loadWeatherForCity(city.id);
    }
  }

  onCityRemoved(cityId: number): void {
    this.selectedCities = this.selectedCities.filter(c => c.id !== cityId);
    this.weatherData = this.weatherData.filter(w => w.cityId !== cityId);
    this.saveSelectedCities();
  }

  private loadWeatherData(): void {
    if (this.selectedCities.length === 0) return;

    this.loading = true;
    const cityIds = this.selectedCities. map(c => c.id);

    this.weatherService.getMultipleWeather(cityIds).subscribe({
      next: (data) => {
        this.weatherData = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading weather data:', error);
        this.loading = false;
      }
    });
  }

  private loadWeatherForCity(cityId:  number): void {
    this.weatherService.getWeather(cityId).subscribe({
      next: (data) => {
        this.weatherData.push(data);
      },
      error: (error) => {
        console.error('Error loading weather for city:', error);
      }
    });
  }

  private saveSelectedCities(): void {
    localStorage.setItem('selectedCities', JSON.stringify(this. selectedCities));
  }

  refreshWeather(): void {
    this.loadWeatherData();
  }
}