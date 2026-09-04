import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Catalogo } from '../../../services/catalogo';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './productos.html',
  styleUrls: ['./productos.css']
})
export class Productos implements OnInit {
  productos: any[] = [];
  categorias: any[] = []; // Para llenar el select desplegable
  isLoading = false;
  
  // Modal state
  showModal = false;
  // Formulario
  nuevoProducto = {
    nombre: '',
    descripcion: '',
    precio: null as number | null,
    categoria_id: null as number | null,
    modelo_3d_url: ''
  };
  isSaving = false;

  constructor(private catalogoService: Catalogo, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadProductos();
    this.loadCategorias();
  }

  loadProductos() {
    this.isLoading = true;
    this.cdr.detectChanges();
    this.catalogoService.getProductos().subscribe({
      next: (data) => {
        this.productos = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadCategorias() {
    this.catalogoService.getCategorias().subscribe({
      next: (data) => {
        this.categorias = data;
        this.cdr.detectChanges();
      }
    });
  }

  getCategoriaNombre(id: number): string {
    const cat = this.categorias.find(c => c.id === id);
    return cat ? cat.nombre : 'Desconocida';
  }

  openModal() {
    this.nuevoProducto = {
      nombre: '',
      descripcion: '',
      precio: null,
      categoria_id: null,
      modelo_3d_url: ''
    };
    this.showModal = true;
    this.cdr.detectChanges();
  }

  closeModal() {
    this.showModal = false;
    this.cdr.detectChanges();
  }

  guardarProducto() {
    if (!this.nuevoProducto.nombre || !this.nuevoProducto.precio || !this.nuevoProducto.categoria_id) return;
    
    const payload = {
      ...this.nuevoProducto,
      modelo_3d_url: this.nuevoProducto.modelo_3d_url || null
    };

    this.isSaving = true;
    this.cdr.detectChanges();
    this.catalogoService.createProducto(payload).subscribe({
      next: (res) => {
        this.isSaving = false;
        this.closeModal();
        this.loadProductos();
      },
      error: (err) => {
        console.error(err);
        this.isSaving = false;
        this.cdr.detectChanges();
      }
    });
  }
}
