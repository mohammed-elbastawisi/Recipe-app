import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, tap} from 'rxjs/operators';
import {BehaviorSubject, throwError} from 'rxjs';

import {User} from './user.model';
import {Router} from '@angular/router';


export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({providedIn: 'root'})
export class AuthService {
  user = new BehaviorSubject<User>(null);
  token: string = null;
  tokenExpirationTimer: any;

  constructor(private http: HttpClient, private router: Router) {
  }

  // tslint:disable-next-line:typedef
  signUp(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCGpviKtOD_YxK86JWTXt1QXkhOqgS_p2E',
      {
        email: email,
        password: password,
        returnSecureToken: true
      }).pipe(catchError(this.errorHandle), tap(resData => {
      this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
    }));
  }

  // tslint:disable-next-line:typedef
  autoLogin() {
    const userData: User = JSON.parse(localStorage.getItem('userData'));
    if (userData) {
      if (userData.token) {
        this.user.next(userData);
      }
    }
  }

  // tslint:disable-next-line:typedef
  logIn(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCGpviKtOD_YxK86JWTXt1QXkhOqgS_p2E',
      {
        email: email,
        password: password,
        returnSecureToken: true
      }).pipe(catchError(this.errorHandle), tap(resData => {
      this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
    }));
  }

  // tslint:disable-next-line:typedef
  logOut() {
    this.user.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  // tslint:disable-next-line:typedef
  autoLogout(expirationDuration: number) {
    console.log(expirationDuration);
    this.tokenExpirationTimer = setTimeout(() => {
      this.logOut();
    }, expirationDuration);
  }

  // tslint:disable-next-line:typedef
  private handleAuthentication(email: string, id: string, token: string, expireIn: number) {
    const expirationDate = new Date(new Date().getTime() + expireIn * 1000);
    const user = new User(email, id, token, expirationDate);
    this.user.next(user);
    this.autoLogout(expireIn * 1000);
    // here we are adding data to local storage to auto=LogIn
    localStorage.setItem('userData', JSON.stringify(user));
  }

  // tslint:disable-next-line:typedef
  private errorHandle(errorRes: HttpErrorResponse) {
    let errorMessage = 'An error Occurred';
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(errorMessage);
    }
    switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'this email is already exists!';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'this email is not found';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'this password is not correct';
        break;
    }
    return throwError(errorMessage);
  }
}
