import { Actions, ofType } from '@ngrx/effects';
import * as AuthActions from './auth.actions';

export class AuthEffects {
    authLogin = this.actions$.pipe( // ngrx effects will subscribe for you
        ofType(AuthActions.LOGIN_START)
    );

    constructor(private actions$: Actions) { }
}