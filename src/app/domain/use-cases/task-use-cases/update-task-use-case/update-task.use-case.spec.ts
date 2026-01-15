import { TestBed } from '@angular/core/testing';
import { TaskRule } from '../../../entities/task-rule.entity';
import { UpdateTaskUseCase } from './update-task.use-case';
import { TaskRuleRepository } from '../../../repositories/task-rule.repository';
import { TaskValidator } from '../../../validators/task-validator/task.validator';
import { Difficulty, Frequency, Priority } from '../../../entities/task-types.entity';

describe('UpdateTaskUseCase', () => {

  let updateTaskUseCase: UpdateTaskUseCase;
  let taskRuleRepositoryMock: any;
  let taskValidatorSpy : any;
  let mockTask : TaskRule;
  const userId = '1';

  beforeEach(() => {
    taskRuleRepositoryMock = {
      update: jest.fn()
    };

    taskValidatorSpy = jest.spyOn(TaskValidator, 'validate');

    TestBed.configureTestingModule({
      providers: [
        UpdateTaskUseCase,
        { provide: TaskRuleRepository, useValue: taskRuleRepositoryMock }
      ]
    });

    updateTaskUseCase = TestBed.inject(UpdateTaskUseCase);

    mockTask = {
      id: '1',
      userId: '1',
      title: 'Teste Unitário',
      description: 'Testando UpdateTaskUseCase',
      priority: Priority.HIGH,
      difficulty: Difficulty.HARD,
      frequency: Frequency.NONE,
      xpReward: 50,
      isXpManual: false,
      startDate: new Date(),
      endDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date('2025-01-01')
    } as TaskRule;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update task successfully when task data is valid', async () => {

    taskValidatorSpy.mockImplementation(() => {});
    taskRuleRepositoryMock.update.mockReturnValue(Promise.resolve());
    const initialUpdatedAt : Date = mockTask.updatedAt;

    await updateTaskUseCase.execute(mockTask, userId);

    expect(taskValidatorSpy).toHaveBeenCalledWith(mockTask);
    expect(taskRuleRepositoryMock.update).toHaveBeenCalledWith(mockTask);
    expect(mockTask.updatedAt).not.toEqual(initialUpdatedAt);
  });

  it('should handle with task without id', async () => {
    mockTask.id = '';

    await expect(updateTaskUseCase.execute(mockTask,userId))
      .rejects.toThrow('Não é possível atualizar uma tarefa sem ID.');

    expect(taskValidatorSpy).not.toHaveBeenCalled();
    expect(taskRuleRepositoryMock.update).not.toHaveBeenCalled();
  });

  it('should handle with unauthorized user request', async () => {

    mockTask.userId = '2';

    await expect(updateTaskUseCase.execute(mockTask,userId))
      .rejects.toThrow('Usuário não autorizado a editar esta tarefa.');

    expect(taskValidatorSpy).not.toHaveBeenCalled();
    expect(taskRuleRepositoryMock.update).not.toHaveBeenCalled();
  });

  it('should throw error when task validation fails', async () => {
    taskValidatorSpy.mockImplementation(() => { throw new Error('Dados inválidos'); });

    await expect(updateTaskUseCase.execute(mockTask,userId)).rejects.toThrow('Dados inválidos');
    expect(taskRuleRepositoryMock.update).not.toHaveBeenCalled();
  });

});
