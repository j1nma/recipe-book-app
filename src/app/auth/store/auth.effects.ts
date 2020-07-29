import { Actions, ofType, Effect } from '@ngrx/effects';
import { switchMap, catchError, map, tap, switchMapTo } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import * as AuthActions from './auth.actions';
import { of, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
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

const handleAuthentication = (expiresIn: number, email: string, userId: string, token: string) => {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    return new AuthActions.AuthenticateSuccess({
        email: email,
        userId: userId,
        token: token,
        expirationDate: expirationDate
    });
};

const handleError = (errorResponse: any) => {
    let errorMessage = 'An unknown error occured';
    if (!errorResponse.error || !errorResponse.error.error) {
        return of(new AuthActions.AuthenticateFail(errorMessage));
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
    return of(new AuthActions.AuthenticateFail(errorMessage));
};

@Injectable()
export class AuthEffects {

    constructor(
        private actions$: Actions,
        private http: HttpClient,
        private router: Router
    ) { }

    @Effect()
    authLogin = this.actions$.pipe( // ngrx effects will subscribe and dispatch for you
        ofType(AuthActions.LOGIN_START),
        switchMap((authData: AuthActions.LoginStart) => {
            return this.http
                .post<AuthResponseData>(
                    'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseAPIKey
                    , {
                        email: authData.payload.email,
                        password: authData.payload.password,
                        returnSecureToken: true,
                    }
                ).pipe(
                    map(resData => {
                        return handleAuthentication(
                            +resData.expiresIn,
                            resData.email,
                            resData.localId,
                            resData.idToken
                        );
                    }),
                    catchError(errorResponse => {
                        return handleError(errorResponse);
                    }))
        }),
    );

    @Effect({ dispatch: false })
    authSuccess = this.actions$.pipe(
        ofType(AuthActions.AUTHENTICATE_SUCCESS),
        tap(() => {
            this.router.navigate(['/']);
        }));

    @Effect()
    authSignup = this.actions$.pipe(
        ofType(AuthActions.SIGNUP_START),
        switchMap((signupAction: AuthActions.SignupStart) => {
            return this.http
                .post<AuthResponseData>(
                    'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseAPIKey
                    , {
                        email: signupAction.payload.email,
                        password: signupAction.payload.password,
                        returnSecureToken: true,
                    }
                ).pipe(
                    map(resData => {
                        return handleAuthentication(
                            +resData.expiresIn,
                            resData.email,
                            resData.localId,
                            resData.idToken
                        );
                    }),
                    catchError(errorResponse => {
                        return handleError(errorResponse);
                    }))
        }),
    );
}