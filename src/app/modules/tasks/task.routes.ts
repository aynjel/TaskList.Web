import { Routes } from '@angular/router';
import { TasksComponent } from './tasks.component';

export const routes: Routes = [
  {
    path: '',
    component: TasksComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
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
      {
        path: 'upload',
        loadComponent: () =>
          import('./components/upload/upload.component').then((m) => m.UploadComponent),
      },
      {
        path: 'review',
        loadComponent: () =>
          import('./components/review/review.component').then((m) => m.ReviewComponent),
      },
    ],
  },
];
