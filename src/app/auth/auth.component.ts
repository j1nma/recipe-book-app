import {
  Component,
  ComponentFactoryResolver,
  ViewChild,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder/placeholder.directive';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
})
export class AuthComponent implements OnInit, OnDestroy {
  isLoginMode = true;
  isLoading = false;
  errorMessage: string = null;
  @ViewChild(PlaceholderDirective, { static: false })
  alertHost: PlaceholderDirective;

  private closeSub: Subscription;
  private storeSub: Subscription;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit(): void {
    this.storeSub = this.store.select('auth').subscribe((authState) => {
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

    if (this.isLoginMode) {
      this.store.dispatch(
        new AuthActions.LoginStart({
          email: email,
          password: password,
        })
      );
    } else {
      this.store.dispatch(
        new AuthActions.SignupStart({
          email: email,
          password: password,
        })
      );
    }

    form.reset();
  }

  onHandleError() {
    this.store.dispatch(new AuthActions.ClearError());
  }

  ngOnDestroy(): void {
    if (this.closeSub) this.closeSub.unsubscribe();
    if (this.storeSub) this.storeSub.unsubscribe();
  }

  // ngIf approach is better than this programmatical approach
  private showErrorAlert(message: string) {
    // programmatically create alert component
    const alertComponentFactory = this.componentFactoryResolver.resolveComponentFactory(
      AlertComponent
    );

    // tell Angular where we want to add it
    const hostViewContainerRef = this.alertHost.viewContainerRef;
    hostViewContainerRef.clear(); // render anything that was before

    const componentRef = hostViewContainerRef.createComponent(
      alertComponentFactory
    );

    componentRef.instance.message = message;
    this.closeSub = componentRef.instance.close.subscribe(() => {
      this.closeSub.unsubscribe(); // clear subscription, remove component
      hostViewContainerRef.clear();
    });
  }
}
