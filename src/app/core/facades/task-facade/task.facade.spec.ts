import { TestBed } from '@angular/core/testing';
import { TaskFacade } from './task.facade';
import { AuthService } from '../../services/auth/auth.service';
import { CreateTaskUseCase } from '../../../domain/use-cases/task-use-cases/create-task-use-case/create-task.use-case';
import { UpdateTaskUseCase } from '../../../domain/use-cases/task-use-cases/update-task-use-case/update-task.use-case';
import { DeleteTaskUseCase } from '../../../domain/use-cases/task-use-cases/delete-task-use-case/delete-task.use-case';
import { TaskRuleRepository } from '../../../domain/repositories/task-rule.repository';
import { TaskRule } from '../../../domain/entities/task-rule.entity';
import {Difficulty, Frequency, Priority, TaskStatus} from '../../../domain/entities/task-types.entity';
import {of, throwError} from 'rxjs';

describe('TaskFacade', () => {
  let taskFacade: TaskFacade;
  let authServiceMock: any;
  let taskRuleRepositoryMock: any;
  let createTaskUseCaseMock: any;
  let updateTaskUseCaseMock: any;
  let deleteTaskUseCaseMock: any;
  let mockTask: TaskRule;

  beforeEach(() => {
    authServiceMock = {
      mapToDomain: jest.fn(),
      loginWithEmailAndPassword: jest.fn(),
      loginWithGoogle: jest.fn(),
      logout: jest.fn(),
      isAuthenticated: jest.fn(),
      getValidUserId: jest.fn()
    };

    taskRuleRepositoryMock = {
      getAll: jest.fn(),
      getById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    };

    createTaskUseCaseMock = {
      execute: jest.fn()
    };

    updateTaskUseCaseMock = {
      execute: jest.fn()
    };

    deleteTaskUseCaseMock = {
      execute: jest.fn()
    };

    mockTask = {
      id: '1',
      userId: '1',
      title: 'Teste Unitário',
      description: 'Testando task facade',
      priority: Priority.HIGH,
      difficulty: Difficulty.HARD,
      frequency: Frequency.NONE,
      xpReward: 50,
      isXpManual: false,
      startDate: new Date(),
      endDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    TestBed.configureTestingModule({
      providers: [
        TaskFacade,
        {provide: AuthService, useValue: authServiceMock},
        {provide: TaskRuleRepository, useValue: taskRuleRepositoryMock},
        {provide: CreateTaskUseCase, useValue: createTaskUseCaseMock},
        {provide: UpdateTaskUseCase, useValue: updateTaskUseCaseMock},
        {provide: DeleteTaskUseCase, useValue: deleteTaskUseCaseMock},
      ]
    });

    taskFacade = TestBed.inject(TaskFacade);
  });

  it('should be created', () => {
    expect(taskFacade).toBeTruthy();
  });

  it('should load tasks and update signal with data from repository', () => {
    const fakeTaskList: TaskRule[] = [mockTask];
    authServiceMock.getValidUserId.mockReturnValue('1');
    taskRuleRepositoryMock.getAll.mockReturnValue(of(fakeTaskList));

    taskFacade.loadTasks();

    expect(taskRuleRepositoryMock.getAll).toHaveBeenCalledWith('1');
    expect(taskFacade.tasks()).toEqual(fakeTaskList);
  });

  it('should handle auth errors when loading tasks (catch error callback)', () => {

    authServiceMock.getValidUserId.mockImplementation(() => {
      throw new Error('Erro Simulado');
    });
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {
    });

    taskFacade.loadTasks();

    expect(consoleSpy).toHaveBeenCalledWith('Não foi possível carregar tarefas: Usuário não autenticado.');
    expect(taskFacade.tasks()).toEqual([]);

    consoleSpy.mockRestore();
  });

  it('should handle repository errors (subscribe error callback)', () => {

    authServiceMock.getValidUserId.mockReturnValue('1');
    taskRuleRepositoryMock.getAll.mockReturnValue(throwError(() => new Error('Erro no Banco')));
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {
    });

    taskFacade.loadTasks();


    expect(consoleSpy).toHaveBeenCalledWith('Erro ao carregar tarefas', expect.any(Error));

    consoleSpy.mockRestore();
  });

  it('should return task by id from cache', () => {
    taskFacade.tasks.set([mockTask]);

    taskFacade.getById('1').subscribe((result) => {
      expect(result).toEqual(mockTask);
    });
    expect(taskRuleRepositoryMock.getById).not.toHaveBeenCalled();
  });

  it('should return task by id from repository', () => {
    taskRuleRepositoryMock.getById.mockReturnValue(of(mockTask));

    taskFacade.tasks.set([]);

    taskFacade.getById('1').subscribe((result) => {
      expect(result).toEqual(mockTask);
    });
    expect(taskRuleRepositoryMock.getById).toHaveBeenCalled();
  });

  it('should return undefined when task not found', () => {
    taskRuleRepositoryMock.getById.mockReturnValue(of(undefined));
    taskFacade.tasks.set([]);

    taskFacade.getById('999').subscribe((result) => {
      expect(result).toBeUndefined();
    });
  });

  it('should call create task use case', async () => {
    authServiceMock.getValidUserId.mockReturnValue('1');
    createTaskUseCaseMock.execute.mockReturnValue(Promise.resolve());

    await taskFacade.create(mockTask);

    expect(createTaskUseCaseMock.execute).toHaveBeenCalledWith(mockTask, '1');
  });

  it('should call update task use case', async () => {
    authServiceMock.getValidUserId.mockReturnValue('1');
    updateTaskUseCaseMock.execute.mockReturnValue(Promise.resolve());

    await taskFacade.update(mockTask);

    expect(updateTaskUseCaseMock.execute).toHaveBeenCalledWith(mockTask, '1');
  });

  it('should call delete task use case', async () => {
    authServiceMock.getValidUserId.mockReturnValue('1');
    deleteTaskUseCaseMock.execute.mockReturnValue(Promise.resolve());

    await taskFacade.delete('1');

    expect(deleteTaskUseCaseMock.execute).toHaveBeenCalledWith('1', '1');
  });

  it('should propagate error if user is not authenticated (create)', async () => {

    authServiceMock.getValidUserId.mockImplementation(() => {
      throw new Error('Usuário não autenticado.');
    });

    await expect(taskFacade.create(mockTask)).rejects.toThrow('Usuário não autenticado.');

    expect(createTaskUseCaseMock.execute).not.toHaveBeenCalled();
  });

  it('should propagate error if user is not authenticated (update)', async () => {

    authServiceMock.getValidUserId.mockImplementation(() => {
      throw new Error('Usuário não autenticado.');
    });

    await expect(taskFacade.update(mockTask)).rejects.toThrow('Usuário não autenticado.');

    expect(updateTaskUseCaseMock.execute).not.toHaveBeenCalled();
  });

  it('should propagate error if user is not authenticated (delete)', async () => {

    authServiceMock.getValidUserId.mockImplementation(() => {
      throw new Error('Usuário não autenticado.');
    });

    await expect(taskFacade.delete('1')).rejects.toThrow('Usuário não autenticado.');

    expect(deleteTaskUseCaseMock.execute).not.toHaveBeenCalled();
  });

  it('should toggle task status (smoke test)', async () => {
    // @TODO: Depois de atualizar o método 'toogleTaskStatus', atualizar este teste
    await expect(taskFacade.toggleTaskStatus('1', TaskStatus.COMPLETED)).resolves.not.toThrow();
  });

});
