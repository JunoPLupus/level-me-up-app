import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TaskFormComponent } from '../task-form/task-form.component';
import { TaskRule } from '../../../domain/entities/task-rule.entity';
import { TaskFacade } from '../../../core/facades/task-facade/task.facade';
import { TaskFormOutput } from '../../../domain/entities/task-types.entity';

@Component({
  selector: 'app-task-create',
  standalone: true,
  imports: [
    TaskFormComponent
  ],
  templateUrl: './task-create.component.html',
})

export class TaskCreateComponent {
  private taskFacade : TaskFacade = inject(TaskFacade);
  private router : Router = inject(Router);

  /**
   * @param formOutput Os dados da tarefa vindos do formulário (task-form).
   */
  async handleSave(formOutput : TaskFormOutput): Promise<void> {

    const { keepAdding, id, ...rawTaskData } = formOutput;

    const taskToCreate: TaskRule = {
      ...rawTaskData
    } as TaskRule;

    try {
      await this.taskFacade.create(taskToCreate);

      if (keepAdding) {
        console.info('✨ Tarefa criada! Pronto para a próxima.');
        // @TODO: aqui futuramente entra this.notificationService.success('...');
      } else {
        await this.router.navigate(['/tasks']);
      }

    } catch (error) {
      console.error('❌ Erro crítico ao criar tarefa:', error);
      // @TODO: aqui futuramente entra this.notificationService.error('Erro ao criar...');
    }
  }
}
