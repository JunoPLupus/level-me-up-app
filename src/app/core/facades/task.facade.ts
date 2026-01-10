import { Injectable, inject, signal, WritableSignal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { TaskRule } from '../../domain/entities/task-rule.entity';
import { TaskRuleRepository } from '../../domain/repositories/task-rule.repository';
import { TaskStatus } from '../../domain/entities/task-types.entity';
import { CreateTaskUseCase } from '../../domain/use-cases/create-task.use-case';
import { UpdateTaskUseCase } from '../../domain/use-cases/update-task.use-case';
import { DeleteTaskUseCase } from '../../domain/use-cases/delete-task.use-case';
import {AuthService} from '../services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})

export class TaskFacade {
  private authService : AuthService = inject(AuthService);
  private taskRepository : TaskRuleRepository = inject(TaskRuleRepository);
  private createTaskUseCase : CreateTaskUseCase = inject(CreateTaskUseCase);
  private updateTaskUseCase : UpdateTaskUseCase = inject(UpdateTaskUseCase);
  private deleteTaskUseCase : DeleteTaskUseCase = inject(DeleteTaskUseCase);

  readonly tasks : WritableSignal<TaskRule[]> = signal<TaskRule[]>([]);

  loadTasks() : void {

    try {
      const currentUserId : string = this.authService.getValidUserId();
      this.taskRepository.getAll(currentUserId).subscribe({
        next: (data) => {
          this.tasks.set(data);
        },
        error: (err) => console.error('Erro ao carregar tarefas', err)
      });
    } catch (error) {
      // @TODO: Se der erro de auth, limpa a lista e loga (ou redireciona p/ login futuramente)
      console.warn('Não foi possível carregar tarefas: Usuário não autenticado.');
      this.tasks.set([]);
    }

  }


  getById(taskId: string) : Observable<TaskRule | undefined> {
    const cachedTasks : TaskRule | undefined = this.tasks().find(task => task.id === taskId);
    if (cachedTasks) return of(cachedTasks);

    return this.taskRepository.getById(taskId);
  }

  async create(task: TaskRule) : Promise<void> {
    const currentUserId : string = this.authService.getValidUserId();

    return this.createTaskUseCase.execute(task, currentUserId);
  }

  async update(task: TaskRule): Promise<void> {
    const currentUserId : string = this.authService.getValidUserId();

    return this.updateTaskUseCase.execute(task, currentUserId);
  }

  async delete(taskId: string): Promise<void> {
    const currentUserId : string = this.authService.getValidUserId();

    return this.deleteTaskUseCase.execute(taskId, currentUserId);
  }

  async toggleTaskStatus(taskId: string, status: TaskStatus): Promise<void> {
    // @TODO futuramente chama: taskRepository.createHistory({ taskId, status, date: new Date() })
    console.log(`[Facade] Alterando status da tarefa ${taskId} para ${status}`);
    return Promise.resolve();
  }
}
