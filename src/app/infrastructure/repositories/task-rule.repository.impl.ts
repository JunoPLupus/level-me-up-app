import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { TaskRule } from '../../domain/entities/task-rule.entity';
import { TaskRuleRepository } from '../../domain/repositories/task-rule.repository';
import { Priority, Difficulty, Frequency } from '../../domain/entities/task-types.entity';

@Injectable({
  providedIn: 'root'
})

export class TaskRuleRepositoryImpl implements TaskRuleRepository {

  private tasks: TaskRule[] = [ // @TODO: Substituir por uma API real
    {
      id: '1',
      userId: '1',
      title: 'Estudar Arquitetura Limpa',
      priority: Priority.HIGH,
      difficulty: Difficulty.HARD,
      frequency: Frequency.NONE,
      xpReward: 50,
      isXpManual: false,
      startDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '2',
      userId: '1',
      title: 'Configurar GitHub Actions',
      priority: Priority.MEDIUM,
      difficulty: Difficulty.MEDIUM,
      frequency: Frequency.DAILY,
      xpReward: 20,
      isXpManual: false,
      startDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  getAll(userId: string): Observable<TaskRule[]> {
    return of(this.tasks.filter(task => task.userId === userId));
  }

  getById(taskId: string): Observable<TaskRule | undefined> {
    return of(this.tasks.find(task => task.id === taskId));
  }

  create(taskRule: TaskRule): Promise<void> {
    this.tasks.push(taskRule);
    console.log('📝 [MOCK] Tarefa salva na memória:', taskRule);
    return Promise.resolve();
  }

  update(taskRule: TaskRule): Promise<void> {
    const index : number = this.tasks.findIndex(task => task.id === taskRule.id);

    if ( index == -1 ) return Promise.reject(new Error(`Tarefa com id ${taskRule.id} não encontrada.`));

    this.tasks[index] = taskRule;
    return Promise.resolve();
  }

  delete(taskId: string): Promise<void> {
    const index : number = this.tasks.findIndex(task => task.id === taskId);

    if ( index == -1 ) return Promise.reject(new Error(`Tarefa com id ${taskId} não encontrada.`));

    this.tasks.splice(index, 1);
    return Promise.resolve();
  }
}
