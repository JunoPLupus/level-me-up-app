import { TaskRule } from '../../entities/task-rule.entity';
import { Difficulty, Frequency, Priority } from '../../entities/task-types.entity';
import { TaskValidator } from './task.validator';

describe('TaskValidator', () => {

  let mockTask : TaskRule;

  beforeEach(async () : Promise <void> => {
    mockTask = {
      id: '1',
      userId: '1',
      title: 'Teste Unitário',
      description: 'Testando validador de tarefa',
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
  });

  it('should not allow empty title', () => {
    mockTask.title = '';

    expect(() => TaskValidator.validate(mockTask)).toThrow('O título é obrigatório.');
  });

  it('should not allow invalid start date', () => {
    mockTask.startDate = new Date('data inválida' as any);

    expect(() => TaskValidator.validate(mockTask)).toThrow('Data de início inválida.');
  });

  it('should not allow invalid range date', () => {
    const twoDaysInFuture = new Date();
    twoDaysInFuture.setDate(twoDaysInFuture.getDate() + 2);
    mockTask.startDate = new Date(twoDaysInFuture);

    expect(() => TaskValidator.validate(mockTask)).toThrow('O início não pode ser depois que o fim.');
  });

  it('should create a valid task sucessfully', () => {
    expect(() => TaskValidator.validate(mockTask)).not.toThrow();
  });
});
