import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from './auth.service';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html'
})
export class AuthComponent {
    isLoginMode = true;
    isLoading = false;
    errorMessage: string = null;

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

        this.isLoading = true;
        if (this.isLoginMode) {
            //
        } else {
            this.authService
                .signup(email, password)
                .subscribe(
                    resData => {
                        this.isLoading = false;
                    },
                    error => {
                        this.errorMessage = 'An error occured';
                        this.isLoading = false;
                    });
        }
        form.reset();
    }

}