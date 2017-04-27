import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegisterFormBasicComponent } from './components/register-form-basic-component/register-form-basic-component';

@NgModule({
    declarations: [
        RegisterFormBasicComponent
    ],
    imports: [
        CommonModule,
        FormsModule, ReactiveFormsModule
    ],
    exports: [
        RegisterFormBasicComponent
    ],
    providers: [  ]
})
export class AngularBackendComponents {

}