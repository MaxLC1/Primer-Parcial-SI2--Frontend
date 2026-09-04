import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SeguridadService } from '../../../services/seguridad';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil.html',
  styleUrls: ['./perfil.css']
})
export class Perfil implements OnInit {
  usuario: any = null;
  isLoading = false;

  newPassword = '';
  isSaving = false;
  successMsg = '';
  errorMsg = '';

  constructor(
    private seguridad: SeguridadService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadMyProfile();
  }

  loadMyProfile() {
    this.isLoading = true;
    this.cdr.detectChanges();
    this.seguridad.getUsuarios().subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          this.usuario = data[0]; 
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  cambiarPassword() {
    if (!this.newPassword || !this.usuario) return;
    this.isSaving = true;
    this.errorMsg = '';
    this.successMsg = '';
    this.cdr.detectChanges();

    this.seguridad.changePassword({ user_id: this.usuario.id, new_password: this.newPassword }).subscribe({
      next: (res) => {
        this.successMsg = '¡Contraseña actualizada exitosamente!';
        this.newPassword = '';
        this.isSaving = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        if (err.error && err.error.detail) {
           if (Array.isArray(err.error.detail)) {
               this.errorMsg = err.error.detail[0].msg;
           } else {
               this.errorMsg = err.error.detail;
           }
        } else {
           this.errorMsg = 'Error al actualizar contraseña.';
        }
        this.isSaving = false;
        this.cdr.detectChanges();
      }
    });
  }
}
