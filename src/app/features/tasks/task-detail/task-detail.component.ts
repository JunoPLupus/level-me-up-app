import {Component, inject, OnInit, signal, WritableSignal} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TaskRule } from '../../../domain/entities/task-rule.entity';
import { TaskFacade } from '../../../core/facades/task.facade';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinner } from '@angular/material/progress-spinner';


@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    DatePipe,

    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatProgressSpinner
  ],
  templateUrl: './task-detail.component.html',
  styleUrl: './task-detail.component.scss'
})

export class TaskDetailComponent implements OnInit {

  private route : ActivatedRoute = inject(ActivatedRoute);
  private router : Router = inject(Router);
  private taskFacade : TaskFacade = inject(TaskFacade);

  task: WritableSignal<TaskRule | undefined> = signal<TaskRule | undefined>(undefined);
  isLoading : WritableSignal<boolean> = signal(true);

  ngOnInit(): void {
    const taskId = this.route.snapshot.paramMap.get('id');

    if (taskId) {
      this.taskFacade.getById(taskId).subscribe({
        next: (foundTask) => {
          if (foundTask) {
            this.task.set(foundTask);
          } else {
            this.router.navigate(['/tasks']);
          }
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('Erro ao buscar tarefa', err);
          this.isLoading.set(false);
        }
      });

    } else {
      this.router.navigate(['/tasks']);
    }
  }
}
