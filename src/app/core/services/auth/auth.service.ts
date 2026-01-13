import { inject, Injectable } from '@angular/core';
import {
  Auth,
  user,
  signInWithEmailAndPassword,
  signOut,
  User as FirebaseUser,
  signInWithPopup,
  GoogleAuthProvider
} from '@angular/fire/auth';
import { Observable, map } from 'rxjs';

import { User } from '../../../domain/entities/user.entity';
import { AuthContract } from '../../../domain/interfaces/auth.contract';
import { isEmpty } from '../../../domain/utils/text.utils';
import { LevelConfiguration } from '../../../domain/entities/level-configuration.entity';
import { UserLevelInfo } from '../../../domain/entities/user-level-info.entity';

@Injectable({
  providedIn: 'root',
})

export class AuthService implements AuthContract {

  private auth: Auth = inject(Auth);

  public currentUser$ : Observable<User | null> = user(this.auth).pipe(
    map(firebaseUser => firebaseUser ? this.mapToDomain(firebaseUser) : null)
  );

  constructor() {}

  private mapToDomain(firebaseUser: FirebaseUser): User {

    // @TODO Pegar esses valores do banco futuramente, atualmente são apenas mocks.
    const initialLevelInfo = {
      currentLevel: 1,
      currentXp: 0,
      xpToNextLevel: 100 // @TODO pegar esse valor do que foi definido em 'initialConfiguration'
    } as UserLevelInfo;

    const initialConfiguration = {
      mode: 'FORMULA',
      formulaParams: {
        baseXp: 100,
        multiplier: 1
      }
    } as LevelConfiguration;

    return {
      uid: firebaseUser.uid,
      displayName: firebaseUser.displayName || 'Usuário',
      email: firebaseUser.email || '',
      photoGoogleUrl: firebaseUser.photoURL || undefined,

      levelInfo: initialLevelInfo,
      levelConfiguration: initialConfiguration
    };
  }

  async loginWithEmailAndPassword(email: string, password: string): Promise<void> {

    await signInWithEmailAndPassword(this.auth, email, password);

    console.log('Login realizado com sucesso.');
  }

  async loginWithGoogle(): Promise<void> {

    const googleProvider = new GoogleAuthProvider();

    await signInWithPopup(this.auth, googleProvider);

  }

  async logout(): Promise<void> {
    await signOut(this.auth);
  }

  isAuthenticated(): boolean {
    return true;
  }

  getUserId(): string | null {
    return this.auth.currentUser ? this.auth.currentUser.uid : null;
  }

  getValidUserId() : string {
    const userId = this.getUserId();

    if(isEmpty(userId)) throw new Error("Usuário não autenticado.");

    return userId as string;
  }
}
