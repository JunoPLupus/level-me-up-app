import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { DeleteTaskUseCase } from './delete-task.use-case';
import { TaskRule } from '../../../entities/task-rule.entity';
import { TaskRuleRepository } from '../../../repositories/task-rule.repository';

describe('DeleteTaskUseCase', () => {
  let deleteTaskUseCase: DeleteTaskUseCase;
  let taskRuleRepositoryMock: any;
  let mockTask: TaskRule;
  const userId = '1';
  const taskId = 'task-123';

  beforeEach(() => {
    taskRuleRepositoryMock = {
      delete: jest.fn(),
      getById: jest.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        DeleteTaskUseCase,
        { provide: TaskRuleRepository, useValue: taskRuleRepositoryMock }
      ]
    });

    deleteTaskUseCase = TestBed.inject(DeleteTaskUseCase);

    mockTask = { id: taskId, userId: '1' } as TaskRule;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should delete task successfully when user is the owner', async () => {
    taskRuleRepositoryMock.getById.mockReturnValue(of(mockTask));
    taskRuleRepositoryMock.delete.mockReturnValue(Promise.resolve());

    await deleteTaskUseCase.execute(taskId, userId);

    expect(taskRuleRepositoryMock.getById).toHaveBeenCalledWith(taskId);
    expect(taskRuleRepositoryMock.delete).toHaveBeenCalledWith(taskId);
  });

  it('should throw error when task is not found', async () => {
    taskRuleRepositoryMock.getById.mockReturnValue(of(null));

    await expect(deleteTaskUseCase.execute(taskId, userId))
      .rejects.toThrow('Tarefa não encontrada.');

    expect(taskRuleRepositoryMock.getById).toHaveBeenCalledWith(taskId);
    expect(taskRuleRepositoryMock.delete).not.toHaveBeenCalled();
  });

  it('should throw error when requester user are unauthorized', async () => {
    mockTask.userId = '2';
    taskRuleRepositoryMock.getById.mockReturnValue(of(mockTask));

    await expect(deleteTaskUseCase.execute(taskId, userId))
      .rejects.toThrow('Usuário não autorizado a deletar esta tarefa.');

    expect(taskRuleRepositoryMock.getById).toHaveBeenCalledWith(taskId);
    expect(taskRuleRepositoryMock.delete).not.toHaveBeenCalled();
  });
});
