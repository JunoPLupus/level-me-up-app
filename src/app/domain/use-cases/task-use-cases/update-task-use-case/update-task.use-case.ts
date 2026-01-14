import { inject, Injectable } from '@angular/core';
import { TaskRule } from '../../../entities/task-rule.entity';
import { TaskRuleRepository } from '../../../repositories/task-rule.repository';
import { TaskValidator } from '../../../validators/task-validator/task.validator';

@Injectable({
  providedIn: 'root'
})

export class UpdateTaskUseCase {

  private taskRepository : TaskRuleRepository = inject(TaskRuleRepository);

  async execute(task: TaskRule, requesterUserId: string): Promise<void> {

    if (!task.id) throw new Error("Não é possível atualizar uma tarefa sem ID.");
    if (task.userId !== requesterUserId) throw new Error("Usuário não autorizado a editar esta tarefa.");

    TaskValidator.validate(task);

    task.updatedAt = new Date();

    return this.taskRepository.update(task);
  }
}
