import { Component, computed, inject, Signal, signal, WritableSignal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { TaskListItemComponent } from './task-list-item.component';
import { AddTaskButtonComponent } from './add-task-button.component';

import { TaskFacade } from '../../../core/facades/task-facade/task.facade';
import { TaskRule } from '../../../domain/entities/task-rule.entity';
import { TaskStatus } from '../../../domain/entities/task-types.entity';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,

    MatChipsModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,

    TaskListItemComponent,
    AddTaskButtonComponent
  ],
  providers: [
    DatePipe
  ],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})

export class TaskListComponent {

  private taskFacade : TaskFacade = inject(TaskFacade);
  private datePipe : DatePipe = inject(DatePipe);

  protected readonly TaskStatus = TaskStatus;

  selectedStatus : WritableSignal<TaskStatus> = signal<TaskStatus>(TaskStatus.PENDING);
  selectedTagId : WritableSignal<string> = signal<string>('ALL');
  selectedDate : WritableSignal<Date> = signal<Date>(new Date());

  private allTasks : WritableSignal<TaskRule[]> = this.taskFacade.tasks;

  // @TODO: Futuramente, isso virá preenchido pelo Backend (TaskHistory).
  completedTaskIds : WritableSignal<Set<string>> = signal<Set<string>>(new Set<string>());

  // @TODO Mock de Categorias (Depois virá do TagFacade)
  availableTags : WritableSignal<string[]> = signal(['Trabalho', 'Estudos', 'Casa']);

  ngOnInit(): void {
    this.taskFacade.loadTasks();
  }

  isTaskCompleted(taskId: string): boolean {
    return this.completedTaskIds().has(taskId);
  }

  async onToggleTask(task: TaskRule, isChecked: boolean): Promise<void> {
    const newStatus = isChecked ? TaskStatus.COMPLETED : TaskStatus.PENDING;

    this.updateLocalStatus(task.id, isChecked);

    try {
      await this.taskFacade.toggleTaskStatus(task.id, newStatus);
    } catch (error) {
      console.error('Erro ao salvar status, revertendo...', error);
      this.updateLocalStatus(task.id, !isChecked);
    }
  }

  private updateLocalStatus(taskId: string, isCompleted: boolean) : void {
    this.completedTaskIds.update(currentSet => {
      const newSet = new Set(currentSet);
      if (isCompleted) {
        newSet.add(taskId);
      } else {
        newSet.delete(taskId);
      }
      return newSet;
    });
  }

  private filteredTasks : Signal<TaskRule[]> = computed(() => {

    const tasks : TaskRule[] = this.allTasks();
    const tagFilter : string = this.selectedTagId();
    const statusFilter : TaskStatus = this.selectedStatus();
    const completedSet : Set<string> = this.completedTaskIds();

    return tasks.filter(task => {
      const matchesTag : boolean = tagFilter === 'ALL' || task.tagId === tagFilter;

      const isCompleted : boolean = completedSet.has(task.id);
      let matchesStatus : boolean = true;

      if (statusFilter === TaskStatus.PENDING) {
        matchesStatus = !isCompleted;
      } else if (statusFilter === TaskStatus.COMPLETED) {
        matchesStatus = isCompleted;
      }

      return matchesTag && matchesStatus;
    });

  });

  tasksCount = computed(() => {
    const tasks : TaskRule[] = this.allTasks();
    const completedSet : Set<string> = this.completedTaskIds();

    const total : number = tasks.length;
    const completed : number = tasks.filter(t => completedSet.has(t.id)).length;

    return {
      pendentes: total - completed,
      concluidas: completed,
      perdidas: 0 // @TODO Configurar essa verificação e mudança de status das tarefas pra perdida no firebase
    };

  });

  displayDate = computed(() => {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (today.toDateString() === this.selectedDate().toDateString()) return 'Hoje';

    else if (tomorrow.toDateString() === this.selectedDate().toDateString()) return 'Amanhã';

    else return this.datePipe.transform(this.selectedDate(), 'dd/MM') || '';

  });


  groupedTasks = computed(() => {

    const tasks : TaskRule[] = this.filteredTasks();

    const grouped = tasks.reduce((collection, task) => {

      const tag : string = task.tagId || 'NONE';

      if (!collection[tag]) collection[tag] = [];

      collection[tag].push(task);

      return collection;

    }, {} as Record<string, TaskRule[]>);

    return Object.entries(grouped);
  });


  changeDateFilter(event: MatDatepickerInputEvent<Date>) : void {
    if (event.value) this.selectedDate.set(event.value);
  }

  changeTagFilter(tagId: string) : void {
    this.selectedTagId.set(tagId);
  }

  changeStatusFilter(filter: TaskStatus) : void {
    this.selectedStatus.set(filter);
  }
}
