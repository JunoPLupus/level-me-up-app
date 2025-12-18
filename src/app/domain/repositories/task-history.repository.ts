import {Observable} from 'rxjs';
import {TaskHistory} from '../entities/task-history.entity';

export abstract class TaskHistoryRepository {
  abstract getAll(userId: string): Observable<TaskHistory[]>;
  abstract getById(TaskHistoryId: string): Observable<TaskHistory | undefined>;

  abstract create(taskHistory: TaskHistory): Promise<void>;
  abstract update(taskHistory: TaskHistory): Promise<void>;
  abstract delete(TaskHistoryId: string): Promise<void>;
}
