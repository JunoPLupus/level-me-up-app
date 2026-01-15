import { TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';

import { AuthService } from './auth.service';

const mockAuthState$ = new BehaviorSubject<any>(null);

jest.mock('@angular/fire/auth', () => {

  return {
    user: () => mockAuthState$.asObservable(),

    signInWithEmailAndPassword: jest.fn(),
    signInWithPopup: jest.fn(),
    signOut: jest.fn(),

    GoogleAuthProvider: jest.fn(),

    getAuth: jest.fn(),
    Auth: jest.fn()
  }
});

import {
  Auth,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  GoogleAuthProvider
} from '@angular/fire/auth';


describe('AuthService', () => {
  let authService : AuthService;
  let authMock : any;

  const firebaseUserMock = {
    uid: '1',
    email: 'test@gmail.com',
    displayName: 'Test User',
    photoURL: null,
    password: '123'
  };

  beforeEach(() => {

    authMock = {
      currentUser: firebaseUserMock
    }

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: Auth, useValue: authMock }
      ]
    });

    authService = TestBed.inject(AuthService);

    mockAuthState$.next(null);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(authService).toBeTruthy();
  });

  it('should transform FirebaseUser to domain User entity', (done) => {
    mockAuthState$.next(firebaseUserMock);

    authService.currentUser$.subscribe(userDomain => {

      expect(userDomain).toBeTruthy();

      expect(userDomain?.uid).toBe(firebaseUserMock.uid);
      expect(userDomain?.email).toBe(firebaseUserMock.email);

      expect(userDomain?.levelInfo).toBeDefined();
      expect(userDomain?.levelConfiguration).toBeDefined();

      done();
    });
  });

  it('should handle with null FirebaseUser (not authenticated)', (done) => {
    authService.currentUser$.subscribe(userDomain => {

      expect(userDomain).toBeNull();

      done();
    });
  });

  it('should login with email and password', async () => {
    (signInWithEmailAndPassword as jest.Mock).mockReturnValue(Promise.resolve(undefined));

    await authService.loginWithEmailAndPassword(
      authMock.currentUser.email,
      authMock.currentUser.password
    );

    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
      authMock,
      authMock.currentUser.email,
      authMock.currentUser.password
    );
  });

  it('should login with google', async () => {
    (signInWithPopup as jest.Mock).mockReturnValue(Promise.resolve(undefined));

    await authService.loginWithGoogle();

    expect(GoogleAuthProvider).toHaveBeenCalled();
    expect(signInWithPopup).toHaveBeenCalledWith(authMock, expect.any(GoogleAuthProvider));
  });

  it('should propagate error when login fails', async () => {

    const firebaseError = new Error('auth/wrong-password');
    (signInWithEmailAndPassword as jest.Mock).mockReturnValue(Promise.reject(firebaseError));

    await expect(authService.loginWithEmailAndPassword('email','password'))
      .rejects.toThrow('auth/wrong-password');
  });

  it('should logout', async () => {
    (signOut as jest.Mock).mockReturnValue(Promise.resolve());

    await authService.logout();

    expect(signOut).toHaveBeenCalledWith(authMock);
  });

  it('should return id if user is authenticated', () => {

    const userId = authService.getUserId();

    expect(userId).toBe(firebaseUserMock.uid);
  });

  it('should throw error if user is not authenticated', () => {
    authMock.currentUser = null;

    expect(() => authService.getValidUserId())
      .toThrow('Usuário não autenticado.')
  });
});
