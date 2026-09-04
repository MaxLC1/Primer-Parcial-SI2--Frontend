import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SeguridadService } from '../../../services/seguridad';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios.html',
  styleUrls: ['./usuarios.css']
})
export class Usuarios implements OnInit {
  usuarios: any[] = [];
  roles: any[] = [];
  isLoading = false;

  showModal = false;
  isSaving = false;
  
  // Registration form
  nombre = '';
  email = '';
  password = '';
  rol_id: number | null = null;
  errorMsg = '';

  constructor(
    private seguridad: SeguridadService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadUsuarios();
    this.loadRoles();
  }

  loadUsuarios() {
    this.isLoading = true;
    this.cdr.detectChanges();
    this.seguridad.getUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadRoles() {
    this.seguridad.getRoles().subscribe({
      next: (data) => {
        this.roles = data;
        this.cdr.detectChanges();
      }
    });
  }

  openModal() {
    this.nombre = '';
    this.email = '';
    this.password = '';
    this.rol_id = null;
    this.errorMsg = '';
    this.showModal = true;
    this.cdr.detectChanges();
  }

  closeModal() {
    this.showModal = false;
    this.cdr.detectChanges();
  }

  guardar() {
    if (!this.nombre || !this.email || !this.password || !this.rol_id) {
      this.errorMsg = 'Por favor, llena todos los campos.';
      return;
    }
    
    this.errorMsg = '';
    this.isSaving = true;
    this.cdr.detectChanges();
    
    const payload = {
      nombre_completo: this.nombre,
      email: this.email,
      password: this.password,
      rol_id: this.rol_id
    };

    this.seguridad.register(payload).subscribe({
      next: () => {
        this.isSaving = false;
        this.closeModal();
        this.loadUsuarios();
      },
      error: (err) => {
        if (err.error && err.error.detail) {
           if (Array.isArray(err.error.detail)) {
               this.errorMsg = err.error.detail[0].msg;
           } else {
               this.errorMsg = err.error.detail;
           }
        } else {
           this.errorMsg = 'Error de conexión con el servidor.';
        }
        this.isSaving = false;
        this.cdr.detectChanges();
      }
    });
  }
}
