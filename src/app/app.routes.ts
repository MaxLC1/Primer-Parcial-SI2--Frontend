import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Shop } from './pages/shop/shop';
import { Home } from './pages/shop/home/home';
import { Dashboard } from './pages/dashboard/dashboard';
import { Categorias } from './pages/dashboard/categorias/categorias';
import { Productos } from './pages/dashboard/productos/productos';
import { Sucursales } from './pages/dashboard/sucursales/sucursales';
import { TallasColores } from './pages/dashboard/tallas-colores/tallas-colores';
import { Inventario } from './pages/dashboard/inventario/inventario';
import { Usuarios } from './pages/dashboard/usuarios/usuarios';
import { Perfil } from './pages/dashboard/perfil/perfil';
import { Ventas } from './pages/dashboard/ventas/ventas';
import { HistorialVentas } from './pages/dashboard/historial-ventas/historial-ventas';
import { Proveedores } from './pages/dashboard/proveedores/proveedores';
import { Colecciones } from './pages/dashboard/colecciones/colecciones';
import { Reservas } from './pages/dashboard/reservas/reservas';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
    { 
      path: '', 
      component: Shop,
      children: [
        { path: '', component: Home }
      ]
    },
    { path: 'login', component: Login },
    { 
      path: 'dashboard', 
      component: Dashboard,
      children: [
        { path: 'productos', component: Productos, canActivate: [roleGuard], data: { roles: ['Administrador', 'Encargado'] } },
        { path: 'categorias', component: Categorias, canActivate: [roleGuard], data: { roles: ['Administrador', 'Encargado'] } },
        { path: 'colecciones', component: Colecciones, canActivate: [roleGuard], data: { roles: ['Administrador', 'Encargado'] } },
        { path: 'proveedores', component: Proveedores, canActivate: [roleGuard], data: { roles: ['Administrador'] } },
        { path: 'sucursales', component: Sucursales, canActivate: [roleGuard], data: { roles: ['Administrador'] } },
        { path: 'variantes', component: TallasColores, canActivate: [roleGuard], data: { roles: ['Administrador', 'Encargado'] } },
        { path: 'inventario', component: Inventario, canActivate: [roleGuard], data: { roles: ['Administrador', 'Encargado'] } },
        { path: 'usuarios', component: Usuarios, canActivate: [roleGuard], data: { roles: ['Administrador'] } },
        { path: 'ventas', component: Ventas, canActivate: [roleGuard], data: { roles: ['Administrador', 'Cajero'] } },
        { path: 'reservas', component: Reservas, canActivate: [roleGuard], data: { roles: ['Administrador', 'Encargado'] } },
        { path: 'historial-ventas', component: HistorialVentas, canActivate: [roleGuard], data: { roles: ['Administrador'] } },
        { path: 'perfil', component: Perfil },
        { path: '', redirectTo: 'perfil', pathMatch: 'full' }
      ]
    }
];
