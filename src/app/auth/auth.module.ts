import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AuthComponent } from './auth.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [
        AuthComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild([{ path: '', component: AuthComponent }]),
        SharedModule
    ],
})
export class AuthModule { }
