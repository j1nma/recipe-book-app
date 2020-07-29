import { Component, ComponentFactoryResolver, ViewChild, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService, AuthResponseData } from './auth.service';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder/placeholder.directive';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html'
})
export class AuthComponent implements OnInit, OnDestroy {
    isLoginMode = true;
    isLoading = false;
    errorMessage: string = null;
    @ViewChild(PlaceholderDirective, { static: false }) alertHost: PlaceholderDirective;

    private closeSub: Subscription;

    constructor(
        private authService: AuthService,
        private router: Router,
        private componentFactoryResolver: ComponentFactoryResolver,
        private store: Store<fromApp.AppState>
    ) { }

    ngOnInit(): void {
        this.store.select('auth').subscribe(authState => {
            this.isLoading = authState.loading;
            this.errorMessage = authState.authError;
            if (this.errorMessage) this.showErrorAlert(this.errorMessage);
        });
    }

    onSwitchMode() {
        this.isLoginMode = !this.isLoginMode;
    }

    onSubmit(form: NgForm) {
        if (!form.value) {
            return; // If the user hacks through 'inspect elements'.
        }
        const email = form.value.email;
        const password = form.value.password;

        let authObs: Observable<AuthResponseData>;

        this.isLoading = true;

        if (this.isLoginMode) {
            // authObs = this.authService.login(email, password);
            this.store.dispatch(new AuthActions.LoginStart(
                {
                    email: email,
                    password: password
                }));
        } else {
            authObs = this.authService.signup(email, password);
        }

        // authObs.subscribe(
        //     resData => {
        //         console.log(resData);
        //         this.isLoading = false;
        //         this.router.navigate(['/recipes']);
        //     },
        //     errorMessage => {
        //         this.errorMessage = errorMessage;
        //         this.showErrorAlert(errorMessage);
        //         this.isLoading = false;
        //     });

        form.reset();
    }

    onHandleError() {
        this.errorMessage = null;
    }

    ngOnDestroy(): void {
        if (this.closeSub) this.closeSub.unsubscribe();
    }

    // ngIf approach is better than this programmatical approach
    private showErrorAlert(message: string) {
        // programmatically create alert component
        const alertComponentFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);

        // tell Angular where we want to add it
        const hostViewContainerRef = this.alertHost.viewContainerRef;
        hostViewContainerRef.clear(); // render anything that was before

        const componentRef = hostViewContainerRef.createComponent(alertComponentFactory);

        componentRef.instance.message = message;
        this.closeSub = componentRef.instance.close.subscribe(() => {
            this.closeSub.unsubscribe(); // clear subscription, remove component
            hostViewContainerRef.clear();
        });
    }

}