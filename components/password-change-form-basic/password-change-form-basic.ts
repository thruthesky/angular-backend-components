import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { User, _USER_PASSWORD_CHANGE, _USER_PASSWORD_CHANGE_RESPONSE } from 'angular-backend';
@Component({
    selector: 'password-change-form-basic',
    templateUrl: './password-change-form-basic.html'
})
export class PasswordChangeFormBasic {


    formGroup: FormGroup;

    @Input() displayError: boolean;
    @Input() routeAfterPasswordChange: string;
    @Input() routeCancel: string;

    @Output() cancel = new EventEmitter<void>();
    @Output() update = new EventEmitter<void>();
    @Output() error = new EventEmitter<string>();


    errorString: string = null;

    constructor(private router: Router, private fb: FormBuilder, private user: User) {

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
        if ( this.routeCancel ) {
            this.router.navigateByUrl(this.routeCancel);
        }
    }

    onClickChangePassword() {
        let req: _USER_PASSWORD_CHANGE = {
            old_password: this.formGroup.get('old_password').value,
            new_password: this.formGroup.get('new_password').value
        };
        this.user.changePassword(req).subscribe((res: _USER_PASSWORD_CHANGE_RESPONSE) => {
            this.update.emit();

            if (this.routeAfterPasswordChange) {
                this.router.navigateByUrl(this.routeAfterPasswordChange);
            }
        }, err => {
            // this.user.alert(err);

            let errstr = this.user.getErrorString(err);
            this.error.emit(errstr);
            if (this.displayError) {
                this.errorString = errstr;
            }
        });
    }

}
