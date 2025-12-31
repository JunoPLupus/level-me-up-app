import { Injectable, inject, signal, WritableSignal } from '@angular/core';
import { TaskRule } from '../../domain/entities/task-rule.entity';
import { TaskRuleRepository } from '../../domain/repositories/task-rule.repository';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';
import { TaskStatus } from '../../domain/entities/task-types.entity';

@Injectable({
  providedIn: 'root'
})

export class TaskFacade {
  private repository : TaskRuleRepository = inject(TaskRuleRepository);

  // tasks = toSignal(this.repository.getAll(), { initialValue: [] });

  readonly tasks : WritableSignal<TaskRule[]> = signal<TaskRule[]>([]);

  loadTasks(userId: string) {
    this.repository.getAll(userId).subscribe({
      next: (data) => {
        this.tasks.set(data);
      },
      error: (err) => console.error('Erro ao carregar tarefas', err)
    });
  }

  getById(id: string) {
    const cached : TaskRule | undefined = this.tasks().find(task => task.id === id);
    if (cached) return of(cached);

    return this.repository.getById(id);
  }

  async create(task: TaskRule) {
    // @TODO futuramente chama: this.createTaskUseCase.execute(task);
    return this.repository.create(task);
  }

  async update(task: TaskRule): Promise<void> {
    return this.repository.update(task);
  }

  async toggleTaskStatus(taskId: string, status: TaskStatus): Promise<void> {
    // @TODO futuramente chama: repository.createHistory({ taskId, status, date: new Date() })
    console.log(`[Facade] Alterando status da tarefa ${taskId} para ${status}`);
    return Promise.resolve();
  }
}
