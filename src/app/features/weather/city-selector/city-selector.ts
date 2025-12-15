import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { WeatherService } from '../../../core/services/weather.service';
import { City } from '../../../core/models/city.model';

@Component({
  selector: 'app-city-selector',
  standalone:  true,
  imports: [CommonModule, FormsModule],
  templateUrl: './city-selector.html',
  styleUrls: ['./city-selector.scss']
})
export class CitySelector {
  @Output() citySelected = new EventEmitter<City>();

  searchTerm = '';
  cities: City[] = [];
  loading = false;
  showDropdown = false;
  private searchSubject = new Subject<string>();

  constructor(private weatherService: WeatherService) {
    this.searchSubject. pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => {
        this.loading = true;
        return this.weatherService.getCities(0, 10, term);
      })
    ).subscribe({
      next: (response) => {
        this.cities = response.cities;
        this.loading = false;
        this.showDropdown = true;
      },
      error: (error) => {
        console. error('Error searching cities:', error);
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    if (this.searchTerm.length >= 2) {
      this.searchSubject.next(this. searchTerm);
    } else {
      this.cities = [];
      this.showDropdown = false;
    }
  }

  selectCity(city: City): void {
    this.citySelected.emit(city);
    this.searchTerm = '';
    this.cities = [];
    this.showDropdown = false;
  }

  onBlur(): void {
    setTimeout(() => {
      this.showDropdown = false;
    }, 200);
  }
}