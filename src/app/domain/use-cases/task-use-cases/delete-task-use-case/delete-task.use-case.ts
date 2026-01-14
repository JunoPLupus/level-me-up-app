import { inject, Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { TaskRule } from '../../../entities/task-rule.entity';
import { TaskRuleRepository } from '../../../repositories/task-rule.repository';

@Injectable({
  providedIn: 'root'
})

export class DeleteTaskUseCase {

  private taskRepository : TaskRuleRepository = inject(TaskRuleRepository);

  async execute(taskId: string, requesterUserId: string): Promise<void> {

    const taskObservable$ : Observable<TaskRule | undefined> = this.taskRepository.getById(taskId);
    const task : TaskRule | undefined = await firstValueFrom(taskObservable$);

    if (!task) throw new Error("Tarefa não encontrada.");
    if (task.userId !== requesterUserId) throw new Error("Usuário não autorizado a deletar esta tarefa.");

    return this.taskRepository.delete(taskId);
  }
}
