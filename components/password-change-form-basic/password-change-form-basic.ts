import { Component, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { User, _USER_PASSWORD_CHANGE, _USER_PASSWORD_CHANGE_RESPONSE } from 'angular-backend';
@Component({
    selector: 'password-change-form-basic',
    templateUrl: './password-change-form-basic.html'
})
export class PasswordChangeFormBasic {


    formGroup: FormGroup;

    @Output() cancel = new EventEmitter<void>();
    @Output() update = new EventEmitter<void>();

    constructor( private fb: FormBuilder, private user: User ) {

    }

    ngOnInit() {
        this.createForm();
    }

    createForm() {
        this.formGroup = this.fb.group({
            old_password: [],
            new_password: []
        });
    }

    onClickCancel() {
        this.cancel.emit();
    }

    onClickChangePassword() {
        let req: _USER_PASSWORD_CHANGE = {
            old_password: this.formGroup.get('old_password').value,
            new_password: this.formGroup.get('new_password').value
        };
        this.user.changePassword( req ).subscribe( (res: _USER_PASSWORD_CHANGE_RESPONSE) => {
            this.update.emit();
        }, err => this.user.alert( err ) );
    }

}
