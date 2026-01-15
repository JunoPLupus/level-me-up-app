import { TestBed } from '@angular/core/testing';
import { CreateTaskUseCase } from './create-task.use-case';
import { TaskRule } from '../../../entities/task-rule.entity';
import { TaskRuleRepository } from '../../../repositories/task-rule.repository';
import { TaskValidator } from '../../../validators/task-validator/task.validator';
import { Difficulty, Frequency, Priority } from '../../../entities/task-types.entity';

describe('CreateTaskUseCase', () => {

  let createTaskUseCase: CreateTaskUseCase;
  let taskRuleRepositoryMock: any;
  let taskValidatorSpy : any;
  let mockTask : TaskRule;
  const userId = '1';

  beforeEach(() => {
    taskRuleRepositoryMock = {
      create: jest.fn()
    };

    taskValidatorSpy = jest.spyOn(TaskValidator, 'validate');

    TestBed.configureTestingModule({
      providers: [
        CreateTaskUseCase,
        { provide: TaskRuleRepository, useValue: taskRuleRepositoryMock }
      ]
    });

    createTaskUseCase = TestBed.inject(CreateTaskUseCase);

    mockTask = {
      id: '1',
      userId: '1',
      title: 'Teste Unitário',
      description: 'Testando CreateTaskUseCase',
      priority: Priority.HIGH,
      difficulty: Difficulty.HARD,
      frequency: Frequency.NONE,
      xpReward: 50,
      isXpManual: false,
      startDate: new Date(),
      endDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    } as TaskRule;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create task successfully when task data is valid', async () => {

    taskValidatorSpy.mockImplementation(() => {});
    taskRuleRepositoryMock.create.mockReturnValue(Promise.resolve());

    await createTaskUseCase.execute(mockTask, userId);

    expect(taskValidatorSpy).toHaveBeenCalledWith(mockTask);
    expect(taskRuleRepositoryMock.create).toHaveBeenCalledWith(mockTask);
  });

  it('should handle with unauthorized user request', async () => {

    mockTask.userId = '2';

    await expect(createTaskUseCase.execute(mockTask,userId))
      .rejects.toThrow('Usuário não autorizado a editar esta tarefa.');

    expect(taskValidatorSpy).not.toHaveBeenCalled();
    expect(taskRuleRepositoryMock.create).not.toHaveBeenCalled();
  });

  it('should throw error when validation fails', async () => {
    taskValidatorSpy.mockImplementation(() => { throw new Error('Dados inválidos'); });

    await expect(createTaskUseCase.execute(mockTask,userId)).rejects.toThrow('Dados inválidos');
    expect(taskRuleRepositoryMock.create).not.toHaveBeenCalled();
  });
});
