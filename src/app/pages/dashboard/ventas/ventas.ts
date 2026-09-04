import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { VentasService } from '../../../services/ventas';

@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ventas.html',
  styleUrls: ['./ventas.css']
})
export class Ventas implements OnInit {
  productos: any[] = [];
  sucursales: any[] = [];
  inventarios: any[] = [];
  tallas: any[] = [];
  colores: any[] = [];
  
  cart: any[] = [];
  sucursalSeleccionada: number | null = null;
  productoSeleccionado: number | null = null;
  tallaSeleccionada: number | null = null;
  colorSeleccionado: number | null = null;
  cantidadSeleccionada: number = 1;
  
  isProcessing = false;
  ventaExitosa = false;

  constructor(
    private ventasService: VentasService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    // Cargar catálogos básicos
    this.http.get<any[]>('http://127.0.0.1:8000/api/v1/catalogo/productos').subscribe(d => this.productos = d);
    this.http.get<any[]>('http://127.0.0.1:8000/api/v1/catalogo/tallas').subscribe(d => this.tallas = d);
    this.http.get<any[]>('http://127.0.0.1:8000/api/v1/catalogo/colores').subscribe(d => this.colores = d);
    this.http.get<any[]>('http://127.0.0.1:8000/api/v1/sucursales/sucursales').subscribe(d => this.sucursales = d);
    this.http.get<any[]>('http://127.0.0.1:8000/api/v1/sucursales/inventarios').subscribe(d => this.inventarios = d);
  }

  getProductoNombre(id: number): string { return this.productos.find(p => p.id === id)?.nombre || ''; }
  getProductoPrecio(id: number): number { return this.productos.find(p => p.id === id)?.precio || 0; }
  getTalla(id: number): string { return this.tallas.find(t => t.id === id)?.nombre || ''; }
  getColor(id: number): string { return this.colores.find(c => c.id === id)?.nombre || ''; }

  getStockDisponible(): number {
    if (!this.sucursalSeleccionada || !this.productoSeleccionado || !this.tallaSeleccionada || !this.colorSeleccionado) return 0;
    
    const inv = this.inventarios.find(i => 
      i.sucursal_id === this.sucursalSeleccionada &&
      i.producto_id === this.productoSeleccionado &&
      i.talla_id === this.tallaSeleccionada &&
      i.color_id === this.colorSeleccionado
    );
    return inv ? inv.cantidad : 0;
  }

  addToCart() {
    if (!this.productoSeleccionado || !this.tallaSeleccionada || !this.colorSeleccionado) return;
    
    const stock = this.getStockDisponible();
    if (this.cantidadSeleccionada > stock) {
      alert("No hay suficiente stock en esta sucursal");
      return;
    }

    const precio = this.getProductoPrecio(this.productoSeleccionado);
    
    // Verificar si ya está en el carrito
    const idx = this.cart.findIndex(i => i.producto_id === this.productoSeleccionado && i.talla_id === this.tallaSeleccionada && i.color_id === this.colorSeleccionado);
    
    if (idx >= 0) {
      if (this.cart[idx].cantidad + this.cantidadSeleccionada > stock) {
         alert("Stock insuficiente para añadir más.");
         return;
      }
      this.cart[idx].cantidad += this.cantidadSeleccionada;
      this.cart[idx].subtotal = this.cart[idx].cantidad * precio;
    } else {
      this.cart.push({
        producto_id: this.productoSeleccionado,
        talla_id: this.tallaSeleccionada,
        color_id: this.colorSeleccionado,
        cantidad: this.cantidadSeleccionada,
        precio_unitario: precio,
        subtotal: precio * this.cantidadSeleccionada
      });
    }
    
    // Reset selections (except branch)
    this.productoSeleccionado = null;
    this.tallaSeleccionada = null;
    this.colorSeleccionado = null;
    this.cantidadSeleccionada = 1;
    this.cdr.detectChanges();
  }

  removeFromCart(index: number) {
    this.cart.splice(index, 1);
    this.cdr.detectChanges();
  }

  getTotal(): number {
    return this.cart.reduce((acc, item) => acc + item.subtotal, 0);
  }

  procesarVenta() {
    if (this.cart.length === 0 || !this.sucursalSeleccionada) return;
    
    this.isProcessing = true;
    this.cdr.detectChanges();
    
    const payload = {
      sucursal_id: this.sucursalSeleccionada,
      usuario_id: 1, // Por ahora quemado hasta tener el AuthService
      detalles: this.cart
    };
    
    this.ventasService.crearVenta(payload).subscribe({
      next: (res: any) => {
        this.isProcessing = false;
        this.ventaExitosa = true;
        this.cart = [];
        this.loadData(); // Refrescar inventario
        this.cdr.detectChanges();
        
        setTimeout(() => {
          this.ventaExitosa = false;
          this.cdr.detectChanges();
        }, 3000);
      },
      error: (err: any) => {
        alert("Error al procesar la venta: " + err.error.detail);
        this.isProcessing = false;
        this.cdr.detectChanges();
      }
    });
  }
}
