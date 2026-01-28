import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () => import('./modules/home/home.component').then((m) => m.HomeComponent),
    title: 'Home',
  },
  {
    path: 'not-found',
    loadComponent: () =>
      import('./shared/pages/not-found/not-found.component').then((m) => m.NotFoundComponent),
    title: 'Not Found',
  },
  {
    path: 'server-error',
    loadComponent: () =>
      import('./shared/pages/server-error/server-error.component').then(
        (m) => m.ServerErrorComponent,
      ),
    title: 'Server Error',
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./modules/dashboard/dashboard.routes').then((m) => m.routes),
    title: 'Dashboard',
  },
  {
    path: 'auth',
    loadChildren: () => import('./modules/auth/auth.routes').then((m) => m.routes),
    title: 'Authentication',
  },
  {
    path: 'tasks',
    loadChildren: () => import('./modules/tasks/task.routes').then((m) => m.routes),
    title: 'Tasks',
  },
];
