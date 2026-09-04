import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VentasService {
  private apiUrl = 'http://34.230.18.9:8000/api/v1/ventas';

  constructor(private http: HttpClient) {}

  crearVenta(venta: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/`, venta);
  }

  getVentas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/`);
  }
}
