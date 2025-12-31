import { Observable } from 'rxjs';
import { User } from '../entities/user.entity';

export abstract class UserRepository {

  abstract getById(id: string): Observable<User | undefined>;

  abstract getByEmail(email: string): Observable<User | undefined>;
  
  abstract create(user: User): Promise<void>;

  abstract update(user: User): Promise<void>;

  abstract delete(id: string): Promise<void>;
}
