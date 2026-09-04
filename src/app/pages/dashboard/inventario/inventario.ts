import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InventarioService } from '../../../services/inventario';
import { Catalogo } from '../../../services/catalogo';
import { SucursalesService } from '../../../services/sucursales';

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inventario.html',
  styleUrls: ['./inventario.css']
})
export class Inventario implements OnInit {
  inventarios: any[] = [];
  isLoading = false;

  sucursales: any[] = [];
  productos: any[] = [];
  tallas: any[] = [];
  colores: any[] = [];

  showModal = false;
  isSaving = false;
  nuevoRegistro = { sucursal_id: null, producto_id: null, talla_id: null, color_id: null, cantidad: 1 };

  constructor(
    private invService: InventarioService,
    private catalogoService: Catalogo,
    private sucursalesService: SucursalesService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadInventario();
    this.loadSelectData();
  }

  loadSelectData() {
    this.sucursalesService.getSucursales().subscribe(res => { this.sucursales = res; this.cdr.detectChanges(); });
    this.catalogoService.getProductos().subscribe(res => { this.productos = res; this.cdr.detectChanges(); });
    this.catalogoService.getTallas().subscribe(res => { this.tallas = res; this.cdr.detectChanges(); });
    this.catalogoService.getColores().subscribe(res => { this.colores = res; this.cdr.detectChanges(); });
  }

  loadInventario() {
    this.isLoading = true;
    this.cdr.detectChanges();
    this.invService.getInventarios().subscribe({
      next: (data) => {
        this.inventarios = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  openModal() {
    this.nuevoRegistro = { sucursal_id: null, producto_id: null, talla_id: null, color_id: null, cantidad: 1 };
    this.showModal = true;
    this.cdr.detectChanges();
  }

  closeModal() {
    this.showModal = false;
    this.cdr.detectChanges();
  }

  guardar() {
    if (!this.nuevoRegistro.sucursal_id || !this.nuevoRegistro.producto_id || 
        !this.nuevoRegistro.talla_id || !this.nuevoRegistro.color_id || 
        this.nuevoRegistro.cantidad < 1) return;
        
    this.isSaving = true;
    this.cdr.detectChanges();
    
    this.invService.addInventario(this.nuevoRegistro).subscribe({
      next: () => {
        this.isSaving = false;
        this.closeModal();
        this.loadInventario();
      },
      error: (err) => {
        console.error(err);
        this.isSaving = false;
        this.cdr.detectChanges();
      }
    });
  }
}
