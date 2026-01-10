import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../../../domain/entities/user.entity';
import { AuthContract } from '../../../domain/interfaces/auth.contract';
import { isEmpty } from '../../../domain/utils/text.utils';

@Injectable({
  providedIn: 'root',
})

export class AuthService implements AuthContract {

  private currentUserSubject : BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  public currentUser$ : Observable<User | null> = this.currentUserSubject.asObservable();

  constructor() {}

  login(email: string, password: string): Promise<void> {
        throw new Error("Method not implemented.");
  }

  logout(): Promise<void> {
      throw new Error("Method not implemented.");
  }

  isAuthenticated(): boolean {
    return true;
  }

  getUserId(): string | null {
    return '1';
  }

  getValidUserId() : string {
    const userId = this.getUserId();

    if(isEmpty(userId)) throw new Error("Usuário não autenticado.");

    return userId as string;
  }
}
