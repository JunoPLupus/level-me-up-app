import { Observable } from 'rxjs';
import { TaskRule } from '../entities/task-rule.entity';

export abstract class TaskRuleRepository {
  abstract getAll(userId: string): Observable<TaskRule[]>;
  abstract getById(taskId: string): Observable<TaskRule | undefined>;

  abstract create(taskRule: TaskRule): Promise<void>;
  abstract update(taskRule: TaskRule): Promise<void>;
  abstract delete(taskId: string): Promise<void>;
}
