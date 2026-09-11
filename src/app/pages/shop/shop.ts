import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CartService, CartItem } from '../../services/cart';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './shop.html',
  styleUrls: ['./shop.css']
})
export class Shop implements OnInit {
  isCartOpen = false;
  isCheckoutOpen = false;
  cartItems: CartItem[] = [];
  
  sucursales: any[] = [];
  sucursalSeleccionada: number | null = null;
  correoCliente: string = '';
  isProcessing = false;

  constructor(public cartService: CartService, private http: HttpClient) {
    this.cartService.cart$.subscribe(items => {
      this.cartItems = items;
    });
  }

  ngOnInit() {
    this.http.get<any[]>('http://localhost:8000/api/v1/sucursales/sucursales').subscribe(res => {
      this.sucursales = res;
    });
  }

  toggleCart() {
    this.isCartOpen = !this.isCartOpen;
  }

  openCheckout() {
    this.isCartOpen = false;
    this.isCheckoutOpen = true;
  }

  closeCheckout() {
    this.isCheckoutOpen = false;
  }

  confirmarReserva() {
    if (!this.sucursalSeleccionada || !this.correoCliente) {
      alert("Por favor completa los datos requeridos.");
      return;
    }
    this.isProcessing = true;

    // Crear el payload de la reserva
    const payload = {
      usuario_id: 2, // Hardcodeado al usuario Cliente por ahora
      sucursal_id: this.sucursalSeleccionada,
      estado: "Pendiente",
      detalles: this.cartItems.map(item => ({
        producto_id: item.producto.id,
        talla_id: item.talla_id || 1, // Por defecto si no eligió
        color_id: item.color_id || 1,
        cantidad: item.cantidad,
        precio_unitario: item.producto.precio,
        subtotal: item.subtotal
      }))
    };

    this.http.post('http://localhost:8000/api/v1/reservas/', payload).subscribe({
      next: () => {
        this.isProcessing = false;
        this.isCheckoutOpen = false;
        this.cartService.clearCart();
        alert("¡Reserva completada con éxito! Puedes pasar a recogerla a la sucursal seleccionada.");
      },
      error: (err) => {
        this.isProcessing = false;
        console.error(err);
        alert("Hubo un error al procesar tu reserva.");
      }
    });
  }

  removeFromCart(index: number) {
    this.cartService.removeFromCart(index);
  }
}
