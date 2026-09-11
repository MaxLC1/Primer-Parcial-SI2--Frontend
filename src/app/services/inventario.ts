import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class InventarioService {
  private apiUrl = 'http://localhost:8000/api/v1/sucursales';

  constructor(private http: HttpClient) {}

  getInventarios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/inventarios`);
  }

  addInventario(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/inventarios`, data);
  }
}
