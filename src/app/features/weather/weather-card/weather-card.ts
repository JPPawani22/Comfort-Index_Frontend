import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Weather } from '../../../core/models/weather.model';

@Component({
  selector: 'app-weather-card',
  standalone:  true,
  imports: [CommonModule],
  templateUrl: './weather-card.html',
  styleUrls: ['./weather-card.scss']
})
export class WeatherCard {
  @Input() weather! : Weather;
  @Output() remove = new EventEmitter<number>();

  getComfortColor(): string {
    if (! this.weather.comfortIndex) return 'bg-gray-500';
    
    const score = this.weather.comfortIndex. score;
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-blue-500';
    if (score >= 40) return 'bg-yellow-500';
    if (score >= 20) return 'bg-orange-500';
    return 'bg-red-500';
  }

  getComfortGradient(): string {
    if (! this.weather.comfortIndex) return '0%';
    return `${this.weather.comfortIndex.score}%`;
  }

  onRemove(): void {
    this.remove.emit(this.weather.cityId);
  }
}