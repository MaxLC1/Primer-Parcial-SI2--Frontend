import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
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

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: Login },
    { 
      path: 'dashboard', 
      component: Dashboard,
      children: [
        { path: 'productos', component: Productos },
        { path: 'categorias', component: Categorias },
        { path: 'sucursales', component: Sucursales },
        { path: 'variantes', component: TallasColores },
        { path: 'inventario', component: Inventario },
        { path: 'usuarios', component: Usuarios },
        { path: 'ventas', component: Ventas },
        { path: 'historial-ventas', component: HistorialVentas },
        { path: 'perfil', component: Perfil },
        { path: '', redirectTo: 'productos', pathMatch: 'full' }
      ]
    }
];
