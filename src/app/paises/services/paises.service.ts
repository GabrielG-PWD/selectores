import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PaisSmall } from '../interfaces/paises.interface';
import { Observable, of } from 'rxjs';
import { Pais } from '../interfaces/paises-full.interface';

@Injectable({
  providedIn: 'root'
})
export class PaisesService {
  private _baseUrl: string = 'https://restcountries.com/v3.1';
  private _regiones: string[] = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

  get regiones(): string[] {
    return [...this._regiones]
  }

  constructor(
    private http: HttpClient
  ) { }

  getPaisesPorRegion(region: string) {
    const url: string = `${this._baseUrl}/region/${region}?fields=name,cca3`;
    return this.http.get<PaisSmall[]>(url);
  }

  getPaisPorcodigo(codigo: string): Observable<Pais | null> {
    if (!codigo) {
      return of(null)
    }

    const url = `${this._baseUrl}/alpha/${codigo}`;
    return this.http.get<Pais>(url);
  }
}
