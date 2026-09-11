import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SucursalesService {
  private apiUrl = 'http://localhost:8000/api/v1/sucursales';

  constructor(private http: HttpClient) {}

  getCiudades(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/ciudades`);
  }

  createCiudad(ciudad: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/ciudades`, ciudad);
  }

  getSucursales(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/sucursales`);
  }

  createSucursal(sucursal: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/sucursales`, sucursal);
  }
}
