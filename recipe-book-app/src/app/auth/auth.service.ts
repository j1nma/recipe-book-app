import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';
import { User } from './user.model';
import { ThrowStmt } from '@angular/compiler';
import { Router } from '@angular/router';

export interface AuthResponseData {
    kind: string;
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
}

@Injectable()
export class AuthService {
    user = new BehaviorSubject<User>(null);

    constructor(
        private http: HttpClient,
        private router: Router
    ) { }

    signup(email: string, password: string) {
        return this.http
            .post<AuthResponseData>(
                'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyD6AY8LQiCsaw8o9DFmtiVc1ViCSty4AK0',
                {
                    email: email,
                    password: password,
                    returnSecureToken: true,
                }
            )
            .pipe(
                catchError(this.handleError),
                tap(res => {
                    this.handleAuthentication(
                        res.email,
                        res.localId,
                        res.idToken,
                        +res.expiresIn
                    );
                })
            );
    }

    login(email: string, password: string) {
        return this.http
            .post<AuthResponseData>(
                'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyD6AY8LQiCsaw8o9DFmtiVc1ViCSty4AK0'
                , {
                    email: email,
                    password: password,
                    returnSecureToken: true,
                }
            )
            .pipe(
                catchError(this.handleError),
                tap(res => {
                    this.handleAuthentication(
                        res.email,
                        res.localId,
                        res.idToken,
                        +res.expiresIn
                    );
                })
            );
    }

    autoLogin() {
        const userData: {
            email: string,
            id: string,
            _token: string,
            _tokenExpirationDate: string
        } = JSON.parse(localStorage.getItem('userData'));
        if (!userData) {
            return;
        }
        const loadedUser = new User(
            userData.email,
            userData.id,
            userData._token,
            new Date(userData._tokenExpirationDate)
        );

        if (loadedUser.token) {
            this.user.next(loadedUser);
        }
    }

    logout() {
        this.user.next(null); // now the entire app treats user as unauthenticated
        this.router.navigate(['/auth']);
    }

    private handleError(errorResponse: HttpErrorResponse) {
        let errorMessage = 'An unknown error occured';
        if (!errorResponse.error || !errorResponse.error.error) {
            return throwError(errorMessage);
        }
        switch (errorResponse.error.error.message) {
            case 'EMAIL_EXISTS':
                errorMessage = 'This email exists.';
                break;
            case 'EMAIL_NOT_FOUND':
                errorMessage = 'This email is not found.';
                break;
            case 'INVALID_PASSWORD':
                errorMessage = 'This password is not correct.';
                break;
        }
        return throwError(errorMessage);
    }

    private handleAuthentication(
        email: string,
        userId: string,
        token: string,
        expiresIn: number
    ) {
        const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
        const user = new User(email, userId, token, expirationDate);
        this.user.next(user);
        localStorage.setItem('userData', JSON.stringify(user));
    }
}