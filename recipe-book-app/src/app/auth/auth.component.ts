import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from './auth.service';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html'
})
export class AuthComponent {
    isLoginMode = true;

    constructor(private authService: AuthService) { }

    onSwitchMode() {
        this.isLoginMode = !this.isLoginMode;
    }

    onSubmit(form: NgForm) {
        if (!form.value) {
            return; // If the user hacks through 'inspect elements'.
        }
        const email = form.value.email;
        const password = form.value.password;

        if (this.isLoginMode) {
            //
        } else {
            this.authService
                .signup(email, password)
                .subscribe(
                    resData => {

                    },
                    error => {
                        console.log(error.message);
                    });
        }
        form.reset();
    }

}