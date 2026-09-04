import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Catalogo } from '../../../services/catalogo';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categorias.html',
  styleUrls: ['./categorias.css']
})
export class Categorias implements OnInit {
  categorias: any[] = [];
  isLoading = false;
  
  // Modal state
  showModal = false;
  nuevaCategoria = { nombre: '' };
  isSaving = false;

  constructor(private catalogoService: Catalogo, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadCategorias();
  }

  loadCategorias() {
    this.isLoading = true;
    this.cdr.detectChanges();
    this.catalogoService.getCategorias().subscribe({
      next: (data) => {
        this.categorias = data;
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

  openModal() {
    this.nuevaCategoria = { nombre: '' };
    this.showModal = true;
    this.cdr.detectChanges();
  }

  closeModal() {
    this.showModal = false;
    this.cdr.detectChanges();
  }

  guardarCategoria() {
    if (!this.nuevaCategoria.nombre) return;
    
    this.isSaving = true;
    this.cdr.detectChanges();
    this.catalogoService.createCategoria(this.nuevaCategoria).subscribe({
      next: (res) => {
        this.isSaving = false;
        this.closeModal();
        this.loadCategorias(); // Recargar la lista
      },
      error: (err) => {
        console.error(err);
        this.isSaving = false;
        this.cdr.detectChanges();
      }
    });
  }
}
