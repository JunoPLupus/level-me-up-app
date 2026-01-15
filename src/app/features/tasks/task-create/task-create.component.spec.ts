import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router} from '@angular/router';
import { provideNativeDateAdapter } from '@angular/material/core';

import { TaskCreateComponent } from './task-create.component';
import { TaskFacade } from '../../../core/facades/task-facade/task.facade';
import {Difficulty, Frequency, Priority, TaskFormOutput} from '../../../domain/entities/task-types.entity';
import {throwError} from 'rxjs';

describe('TaskCreateComponent', () => {
  let taskCreateComponent: TaskCreateComponent;
  let fixture: ComponentFixture<TaskCreateComponent>;
  let taskFacadeMock : any;
  let routerMock : any;

  const mockTaskFormOutput: TaskFormOutput = {
    title: 'Teste Unitário',
    description: 'Criando teste unitário do TaskCreateComponent.',
    tagId: 'tag-1',
    priority: Priority.HIGH,
    frequency: Frequency.NONE,
    difficulty: Difficulty.MEDIUM,
    xpReward: 10,
    isXpManual: false,
    startDate: new Date(),
    keepAdding: false
  };

  beforeEach(async () => {

    taskFacadeMock = {
      create: jest.fn()
    };

    routerMock = {
      navigate: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [TaskCreateComponent],
      providers: [
        { provide: TaskFacade, useValue: taskFacadeMock },
        { provide: Router, useValue: routerMock },
        provideNativeDateAdapter()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskCreateComponent);
    taskCreateComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(taskCreateComponent).toBeTruthy();
  });

  it('should call create and navigate when keepAdding is false', async () => {
    taskFacadeMock.create.mockReturnValue(Promise.resolve(undefined));
    const formOutput = { ...mockTaskFormOutput, keepAdding: false };

    await taskCreateComponent.handleSave(formOutput);

    expect(taskFacadeMock.create).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Teste Unitário',
        priority: Priority.HIGH
      })
    );
    expect(routerMock.navigate).toHaveBeenCalledWith(['/tasks']);
  });

  it('should call create but NOT navigate when keepAdding is true', async () => {
    taskFacadeMock.create.mockReturnValue(Promise.resolve(undefined));
    const formOutput = { ...mockTaskFormOutput, keepAdding: true };

    await taskCreateComponent.handleSave(formOutput);

    expect(taskFacadeMock.create).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Teste Unitário',
        priority: Priority.HIGH
      })
    );
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('should handle error and NOT navigate', async () => {
    const errorMsg = new Error('Erro simulado');
    taskFacadeMock.create.mockRejectedValue(errorMsg);
    jest.spyOn(console, 'error').mockImplementation(() => {});

    await taskCreateComponent.handleSave(mockTaskFormOutput);

    expect(taskFacadeMock.create).toHaveBeenCalled();
    expect(routerMock.navigate).not.toHaveBeenCalled();
    expect(console.error).toHaveBeenCalled();
  });
});
