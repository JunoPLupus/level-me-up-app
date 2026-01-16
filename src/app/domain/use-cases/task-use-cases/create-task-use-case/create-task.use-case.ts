import { inject, Injectable } from '@angular/core';
import { TaskRule } from '../../../entities/task-rule.entity';
import { TaskRuleRepository } from '../../../repositories/task-rule.repository';
import { TaskValidator } from '../../../validators/task-validator/task.validator';

@Injectable({
  providedIn: 'root'
})

export class CreateTaskUseCase {

  private taskRepository : TaskRuleRepository = inject(TaskRuleRepository);

  async execute(task: TaskRule, requesterUserId: string): Promise<void> {

    console.log('origin:', task.userId,', requesterUserId:', requesterUserId) // @TODO remover esta linha depois

    if (task.userId !== requesterUserId) throw new Error("Usuário não autorizado a criar esta tarefa.");

    TaskValidator.validate(task);

    task.id = task.id || crypto.randomUUID();

    task.createdAt = new Date();

    return this.taskRepository.create(task);
  }
}
