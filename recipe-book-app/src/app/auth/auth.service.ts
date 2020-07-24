import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

interface AuthResponseData {
    kind: string;
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
}

@Injectable()
export class AuthService {

    constructor(private http: HttpClient) { }

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
                catchError(errorResponse => {
                    let errorMessage = 'An unknown error occured';
                    if (!errorResponse.error || !errorResponse.error.error) {
                        return throwError(errorMessage);
                    }
                    switch (errorResponse.error.error.message) {
                        case 'EMAIL_EXISTS':
                            errorResponse = 'This email exists.';
                    }
                    return throwError(errorMessage);
                }
                )
            );
    }
}