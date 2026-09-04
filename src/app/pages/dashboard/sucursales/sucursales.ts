import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SucursalesService } from '../../../services/sucursales';

@Component({
  selector: 'app-sucursales',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sucursales.html',
  styleUrls: ['./sucursales.css']
})
export class Sucursales implements OnInit {
  sucursales: any[] = [];
  ciudades: any[] = [];
  isLoading = false;
  
  showModal = false;
  nuevaSucursal = { nombre: '', direccion: '', ciudad_id: null };
  isSaving = false;

  constructor(private sucursalesService: SucursalesService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadCiudades();
    this.loadSucursales();
  }

  loadCiudades() {
    this.sucursalesService.getCiudades().subscribe({
      next: (data) => {
        this.ciudades = data;
        this.cdr.detectChanges();
      }
    });
  }

  loadSucursales() {
    this.isLoading = true;
    this.cdr.detectChanges();
    this.sucursalesService.getSucursales().subscribe({
      next: (data) => {
        this.sucursales = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  openModal() {
    this.nuevaSucursal = { nombre: '', direccion: '', ciudad_id: null };
    this.showModal = true;
    this.cdr.detectChanges();
  }

  closeModal() {
    this.showModal = false;
    this.cdr.detectChanges();
  }

  guardarSucursal() {
    if (!this.nuevaSucursal.nombre || !this.nuevaSucursal.ciudad_id) return;
    
    this.isSaving = true;
    this.cdr.detectChanges();
    this.sucursalesService.createSucursal(this.nuevaSucursal).subscribe({
      next: (res) => {
        this.isSaving = false;
        this.closeModal();
        this.loadSucursales();
      },
      error: (err) => {
        console.error(err);
        this.isSaving = false;
        this.cdr.detectChanges();
      }
    });
  }
}
