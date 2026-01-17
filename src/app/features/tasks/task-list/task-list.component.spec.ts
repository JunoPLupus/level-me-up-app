import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNativeDateAdapter } from '@angular/material/core';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

import { TaskListComponent } from './task-list.component';
import { TaskFacade } from '../../../core/facades/task-facade/task.facade';
import { AuthService } from '../../../core/services/auth/auth.service';
import { Difficulty, Frequency, Priority, TaskStatus } from '../../../domain/entities/task-types.entity';
import { TaskListItemComponent } from './task-list-item.component';

describe('TaskListComponent', () => {
  let taskListComponent: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;
  let taskFacadeMock : any;
  let authServiceMock : any;
  let mockTasks : any[];

  const mockUser = { uid: 'user-123', email: 'test@test.com' };

  beforeEach(async () => {

    taskFacadeMock = {
      tasks: signal([]),
      loadTasks: jest.fn(),
      toggleTaskStatus: jest.fn()
    };

    authServiceMock = {
      currentUser$:  of(mockUser)
    }

    mockTasks = [
      {
        id: '1',
        userId: mockUser.uid,
        title: 'Estudar Arquitetura Limpa',
        tagId: 'tag-1',
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
        userId: mockUser.uid,
        title: 'Configurar GitHub Actions',
        tagId:'tag-2',
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

    await TestBed.configureTestingModule({
      imports: [TaskListComponent],
      providers: [
        DatePipe,
        { provide: TaskFacade, useValue: taskFacadeMock },
        { provide: AuthService, useValue: authServiceMock },
        provideRouter([]),
        provideNativeDateAdapter()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskListComponent);
    taskListComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Initialization', () => {

    it('should create component', () => {
      expect(taskListComponent).toBeTruthy();
    });

    it('should call loadTasks when component is created', () => {
      expect(taskFacadeMock.loadTasks).toHaveBeenCalled();
    });
  });

  describe('FilteredTasks logic', () => {

    it('should return only pending tasks when filter is "pending"', () => {
      taskFacadeMock.tasks.set(mockTasks);

      fixture.detectChanges();

      expect(taskListComponent.filteredTasks().length).toBe(2);
      expect(taskListComponent.filteredTasks()[0].title).toBe('Estudar Arquitetura Limpa');
    });

    it('should return only completed tasks when filter is "completed"', () => {
      taskFacadeMock.tasks.set(mockTasks);
      taskListComponent.completedTaskIds.set(new Set(['1']));
      const filteredTasks = taskListComponent.filteredTasks();
      taskListComponent.selectedStatus.set(TaskStatus.COMPLETED);

      fixture.detectChanges();

      expect(filteredTasks.length).toBe(1);
      expect(filteredTasks[0].id).toBe('2');
    });
  });

  describe('User Interface', () => {

    it('should call toggleTaskStatus when a task-list-item emits the toggle event', () => {
      taskFacadeMock.tasks.set(mockTasks);
      fixture.detectChanges();

      const taskListItemsComponents = fixture.debugElement.queryAll(By.directive(TaskListItemComponent));

      expect(taskListItemsComponents.length).toBeGreaterThan(0);

      const firstTaskListItemComponent = taskListItemsComponents[0];
      const taskToToggle = mockTasks[0];

      firstTaskListItemComponent.triggerEventHandler('statusToggle', true);

      expect(taskFacadeMock.toggleTaskStatus).toHaveBeenCalledWith(
        taskToToggle.id,
        TaskStatus.COMPLETED
      );
    });

    it('should rollback local status if facade fails', async () => {

      const task = mockTasks[0];
      taskFacadeMock.toggleTaskStatus.mockRejectedValue(new Error('Erro de conexão simulado'));


      await taskListComponent.onToggleTask(task, true);


      const isCompleted = taskListComponent.completedTaskIds().has(task.id);
      expect(isCompleted).toBe(false);
      expect(taskFacadeMock.toggleTaskStatus).toHaveBeenCalled();
    });

    it('should render a message when there are no tasks', () => {
      taskFacadeMock.tasks.set([]);
      fixture.detectChanges();
      const groupedTasks = taskListComponent.groupedTasks();

      const noTasksMessage = fixture.debugElement.query(By.css('.empty-state'));

      expect(groupedTasks.length).toBe(0);
      expect(noTasksMessage).toBeTruthy();
    });
  });
});
