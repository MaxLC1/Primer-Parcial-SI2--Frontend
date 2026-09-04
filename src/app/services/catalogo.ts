import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Catalogo {
  private apiUrl = 'http://127.0.0.1:8000/api/v1/catalogo';

  constructor(private http: HttpClient) { }

  getCategorias(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/categorias`);
  }

  createCategoria(categoria: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/categorias`, categoria);
  }

  getProductos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/productos`);
  }

  createProducto(producto: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/productos`, producto);
  }

  getTallas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/tallas`);
  }

  createTalla(talla: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/tallas`, talla);
  }

  getColores(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/colores`);
  }

  createColor(color: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/colores`, color);
  }
}
