import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../entities/user.entity';

export interface AuthContract {

  currentUser$ : Observable<User | null>;

  login(email: string, password: string) : Promise<void>;

  logout() : Promise<void>;

  isAuthenticated() : boolean;

  getUserId() : string | null;

  getValidUserId() : string;
}
