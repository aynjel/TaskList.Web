import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-tasks',
  imports: [RouterOutlet],
  template: `<router-outlet />`,
})
export class TasksComponent {}
