import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

const API_URL = 'http://localhost:8000/api/v1';

@Component({
  selector: 'app-delivery',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './delivery.html',
  styleUrls: ['./delivery.css']
})
export class Delivery implements OnInit {
  deliveries: any[] = [];
  isLoading = true;
  isSaving = false;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.cargarDeliveries();
  }

  async cargarDeliveries() {
    this.isLoading = true;
    try {
      const token = localStorage.getItem('token');
      
      // 1. Obtener los recojos y entregas
      const res = await fetch(`${API_URL}/delivery/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!res.ok) throw new Error('Error al cargar órdenes');
      const data = await res.json();
      
      // 2. Obtener los detalles de las devoluciones y ventas
      const resDevs = await fetch(`${API_URL}/devoluciones/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const devs = resDevs.ok ? await resDevs.json() : [];

      const resVentas = await fetch(`${API_URL}/ventas/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const ventas = resVentas.ok ? await resVentas.json() : [];

      this.deliveries = data.map((d: any) => {
        d.nuevoEstado = d.estado;
        if (d.devolucion_id) {
          d.tipo = 'RECOJO';
          d.devolucion = devs.find((dev: any) => dev.id === d.devolucion_id);
        } else if (d.venta_id) {
          d.tipo = 'ENVÍO';
          d.venta = ventas.find((v: any) => v.id === d.venta_id);
        } else {
          d.tipo = 'DESCONOCIDO';
        }
        return d;
      });
    } catch (e) {
      console.error(e);
      alert('Error al cargar órdenes. Verifica tus permisos.');
    }
    this.isLoading = false;
    this.cdr.detectChanges();
  }

  async actualizarEstado(d: any) {
    if (d.estado === d.nuevoEstado) return;
    
    this.isSaving = true;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/delivery/${d.id}/estado`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ estado: d.nuevoEstado })
      });
      
      if (res.ok) {
        d.estado = d.nuevoEstado;
      } else {
        alert('Error al actualizar estado');
        d.nuevoEstado = d.estado; // rollback UI
      }
    } catch (e) {
      console.error(e);
      d.nuevoEstado = d.estado;
    }
    this.isSaving = false;
    this.cdr.detectChanges();
  }

  getBadgeClass(estado: string): string {
    switch (estado?.toLowerCase()) {
      case 'pendiente': return 'pendiente';
      case 'asignado': return 'asignado';
      case 'en camino': return 'en-camino';
      case 'recogido': return 'recogido';
      case 'completado': return 'completado';
      default: return 'pendiente';
    }
  }
}
