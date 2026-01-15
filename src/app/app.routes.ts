import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'tasks', pathMatch: 'full' },
  {
    path: 'tasks',
    loadComponent: () =>
      import('./features/tasks/task-list/task-list.component').then(m => m.TaskListComponent)
  },
  {
    path: 'tasks/new',
    loadComponent: () =>
      import('./features/tasks/task-add/task-create.component').then(m => m.TaskCreateComponent)
  },
  {
    path: 'tasks/detail/:id',
    loadComponent: () =>
      import('./features/tasks/task-detail/task-detail.component').then(m => m.TaskDetailComponent)
  },
  {
    path: 'tasks/edit/:id',
    loadComponent: () =>
      import('./features/tasks/task-edit/task-edit.component').then(m => m.TaskEditComponent)
  },
];
