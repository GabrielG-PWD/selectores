import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PaisSmall } from '../interfaces/paises.interface';
import { Observable, combineLatest, of } from 'rxjs';
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

  get httpParams() {
    return new HttpParams().set('fields', 'name,cca2,borders')
  }

  constructor(
    private http: HttpClient
  ) { }

  getPaisesPorRegion(region: string): Observable<PaisSmall[]> {
    const url: string = `${this._baseUrl}/region/${region}?fields=name,cca3`;
    return this.http.get<PaisSmall[]>(url);
  }

  getPaisPorCodigo(codigo: string): Observable<Pais | null> {
    if (!codigo) {
      return of(null)
    }

    const url = `${this._baseUrl}/alpha/${codigo}`;
    return this.http.get<Pais>(url, { params: this.httpParams });
  }

  getPaisPorCodigoSmall(codigo: string): Observable<PaisSmall> {

    const url = `${this._baseUrl}/alpha/${codigo}?fields=name,cca3`;
    return this.http.get<PaisSmall>(url, { params: this.httpParams });
  }

  getPaisesPorCodigos(borders: string[]): Observable<PaisSmall[]> {
    if (!borders) {
      return of([]);
    }

    const peticiones: Observable<PaisSmall>[] = [];

    borders.forEach(codigo => {
      const peticion = this.getPaisPorCodigoSmall(codigo);
      peticiones.push(peticion);
    });

    return combineLatest(peticiones);
  }
}
