import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Weather, ComfortIndex } from '../models/weather.model';
import { City, CityResponse } from '../models/city.model';
import { CacheService } from './cache.service';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private cache: CacheService
  ) {}

  getCities(page: number = 0, size: number = 10, search?:  string): Observable<CityResponse> {
    const cacheKey = `cities_${page}_${size}_${search || ''}`;
    const cached = this.cache.get<CityResponse>(cacheKey);
    
    if (cached) {
      return of(cached);
    }

    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    if (search) {
      params = params.set('search', search);
    }

    return this.http.get<CityResponse>(`${this.apiUrl}/cities`, { params }).pipe(
      tap(data => this.cache.set(cacheKey, data)),
      catchError(this.handleError<CityResponse>('getCities', { cities: [], total: 0 }))
    );
  }

  getWeather(cityId:  number): Observable<Weather> {
    const cacheKey = `weather_${cityId}`;
    const cached = this.cache.get<Weather>(cacheKey);
    
    if (cached) {
      return of(cached);
    }

    return this.http.get<Weather>(`${this.apiUrl}/weather/${cityId}`).pipe(
      tap(data => this.cache.set(cacheKey, data, 300000)), // Cache for 5 minutes
      catchError(this.handleError<Weather>('getWeather'))
    );
  }

  getMultipleWeather(cityIds:  number[]): Observable<Weather[]> {
    const params = new HttpParams().set('cityIds', cityIds.join(','));
    
    return this.http.get<Weather[]>(`${this.apiUrl}/weather/multiple`, { params }).pipe(
      catchError(this.handleError<Weather[]>('getMultipleWeather', []))
    );
  }

  getComfortIndex(cityId: number): Observable<ComfortIndex> {
    const cacheKey = `comfort_${cityId}`;
    const cached = this.cache.get<ComfortIndex>(cacheKey);
    
    if (cached) {
      return of(cached);
    }

    return this.http.get<ComfortIndex>(`${this.apiUrl}/weather/${cityId}/comfort`).pipe(
      tap(data => this.cache.set(cacheKey, data, 300000)),
      catchError(this.handleError<ComfortIndex>('getComfortIndex'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: `, error);
      return of(result as T);
    };
  }
}