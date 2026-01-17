import { Component, computed, effect, inject, Signal, signal, WritableSignal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';

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
import { Tag } from '../../../domain/entities/tag.entity';
import { getTagName,
         MOCK_TAGS
       } from '../../../shared/utils/task-ui-constants/task-ui.constants';
import { AuthService } from '../../../core/services/auth/auth.service';
import { RelativeDatePipe } from '../../../shared/pipes/relative-date.pipe';

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

    RelativeDatePipe,

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

  private authService : AuthService = inject(AuthService);
  private taskFacade : TaskFacade = inject(TaskFacade);

  protected readonly TaskStatus = TaskStatus;
  protected readonly getTagName = getTagName;

  selectedStatus : WritableSignal<TaskStatus> = signal<TaskStatus>(TaskStatus.PENDING);
  selectedTagId : WritableSignal<string> = signal<string>('ALL');
  selectedDate : WritableSignal<Date> = signal<Date>(new Date());

  private allTasks : WritableSignal<TaskRule[]> = this.taskFacade.tasks;

  // @TODO: Futuramente, isso virá preenchido pelo Backend (TaskHistory).
  completedTaskIds : WritableSignal<Set<string>> = signal<Set<string>>(new Set<string>());

  // @TODO Mock de Categorias (Depois virá do TagFacade)
  availableTags : WritableSignal<Tag[]> = signal(MOCK_TAGS);

  protected currentUser = toSignal(this.authService.currentUser$);

  constructor() {
    effect(() => {
      const user = this.currentUser();

      if (user) {
        this.taskFacade.loadTasks();
      }
    });
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
    this.completedTaskIds.update(currentTasksSet => {
      const newSet = new Set(currentTasksSet);
      if (isCompleted) {
        newSet.add(taskId);
      } else {
        newSet.delete(taskId);
      }
      return newSet;
    });
  }

  private matchesStatusFilter = (taskIsCompleted: boolean, filterStatus: TaskStatus): boolean => {
    if (filterStatus === TaskStatus.PENDING) return !taskIsCompleted;
    if (filterStatus === TaskStatus.COMPLETED) return taskIsCompleted;
    return true;
  };

  filteredTasks : Signal<TaskRule[]> = computed(() => {

    const tasks : TaskRule[] = this.allTasks();
    const selectedTag : string = this.selectedTagId();
    const selectedStatus : TaskStatus = this.selectedStatus();
    const completedTasksIds : Set<string> = this.completedTaskIds();

    return tasks.filter(task => {
      const matchesTagFilter : boolean = selectedTag === 'ALL' || task.tagId === selectedTag;
      if (!matchesTagFilter) return false;

      const isCompleted : boolean = completedTasksIds.has(task.id);

      return this.matchesStatusFilter(isCompleted, selectedStatus);
    });
  });

  tasksCount = computed(() => {
    const tasks : TaskRule[] = this.allTasks();
    const completedSet : Set<string> = this.completedTaskIds();

    const total : number = tasks.length;
    const completed : number = tasks.filter(task => completedSet.has(task.id)).length;

    return {
      pendentes: total - completed,
      concluidas: completed,
      perdidas: 0 // @TODO Configurar essa verificação e mudança de status das tarefas pra perdida no firebase
    };

  });

  groupedTasks = computed(() => {

    const tasks : TaskRule[] = this.filteredTasks();

    const grouped = tasks.reduce((collection, task) => {

      const tag : string = task.tagId? getTagName(task.tagId) : 'Uncategorized';

      if (!collection[tag]) collection[tag] = [];

      collection[tag].push(task);

      return collection;

    }, {} as Record<string, TaskRule[]>);

    return Object.keys(grouped).map(tagName => ({
      tagName,
      tasks: grouped[tagName]
    }));
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
