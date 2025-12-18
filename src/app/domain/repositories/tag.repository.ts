import {Observable} from 'rxjs';
import {Tag} from '../entities/tag.entity';

export abstract class TagRepository {
  abstract getAll(userId: string): Observable<Tag[]>;
  abstract getById(tagId: string): Observable<Tag | undefined>;

  abstract create(tag: Tag): Promise<void>;
  abstract update(tag: Tag): Promise<void>;
  abstract delete(tagId: string): Promise<void>;
}
