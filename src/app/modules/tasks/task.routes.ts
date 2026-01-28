import { Routes } from '@angular/router';
import { TasksComponent } from './tasks.component';

export const routes: Routes = [
  {
    path: '',
    component: TasksComponent,
    children: [
      {
        path: 'list',
        loadComponent: () =>
          import('./components/list/list.component').then((m) => m.ListComponent),
      },
      {
        path: 'details/:id',
        loadComponent: () =>
          import('./components/details/details.component').then((m) => m.DetailsComponent),
      },
    ],
  },
];
