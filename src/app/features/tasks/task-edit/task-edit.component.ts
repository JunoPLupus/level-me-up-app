import {Component, inject, OnInit, signal, WritableSignal} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { TaskFormComponent } from '../task-form/task-form.component';
import { TaskRule } from '../../../domain/entities/task-rule.entity';
import { TaskFacade } from '../../../core/facades/task-facade/task.facade';
import {TaskFormOutput} from '../../../domain/entities/task-types.entity';
import {MatProgressSpinner} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-task-edit',
  standalone: true,
  imports: [
    CommonModule,
    TaskFormComponent,
    MatProgressSpinner
  ],
  templateUrl: './task-edit.component.html',
})

export class TaskEditComponent implements OnInit {

  private route : ActivatedRoute = inject(ActivatedRoute);
  private router : Router = inject(Router);
  private taskFacade : TaskFacade = inject(TaskFacade);

  taskToEdit : WritableSignal<TaskRule | undefined> = signal<TaskRule | undefined>(undefined);

  isLoading: WritableSignal<boolean> = signal(true);

  ngOnInit(): void {
    const taskId = this.route.snapshot.paramMap.get('id');

    if (taskId) {
      this.taskFacade.getById(taskId).subscribe({
        next: (foundTask) => {
          if (foundTask) {
            this.taskToEdit.set(foundTask);
          } else {
            console.warn('Tarefa não encontrada.');
            this.router.navigate(['/tasks']);
          }
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('Erro ao buscar tarefa:', err);
          this.isLoading.set(false);
          this.router.navigate(['/tasks']);
        }
      });
    } else {
      this.router.navigate(['/tasks']);
    }
  }


  async handleSave(output: TaskFormOutput): Promise<void> {

    const originalTask = this.taskToEdit();
    if (!originalTask || !originalTask.id) return;

    const { keepAdding, ...formValues } = output;

    const taskToUpdate: TaskRule = {
      ...originalTask,
      ...formValues,
      id: originalTask.id
    };

    try {
      this.isLoading.set(true);

      await this.taskFacade.update(taskToUpdate);

      this.router.navigate(['/tasks']);

    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
      this.isLoading.set(false);
    }
  }

}
