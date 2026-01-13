import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TaskFormComponent } from '../task-form/task-form.component';
import { TaskRule } from '../../../domain/entities/task-rule.entity';
import { TaskFacade } from '../../../core/facades/task-facade/task.facade';
import { TaskFormOutput } from '../../../domain/entities/task-types.entity';

@Component({
  selector: 'app-task-add',
  standalone: true,
  imports: [
    TaskFormComponent
  ],
  templateUrl: './task-add.component.html',
})

export class TaskAddComponent {
  private taskFacade : TaskFacade = inject(TaskFacade);
  private router : Router = inject(Router);

  /**
   * @param formOutput Os dados da tarefa vindos do formulário (task-form).
   */
  async handleSave(formOutput : TaskFormOutput): Promise<void> {

    const { keepAdding, id, ...taskData } = formOutput;

    try {
      await this.taskFacade.create(taskData as TaskRule);

      if (!keepAdding) {
        await this.router.navigate(['/tasks']);
      } else {
        console.log('Tarefa criada! O formulário será limpo automaticamente pelo componente filho.');
      }

    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
    }
  }
}
