/**
 * 
 * [displayError] - when set true, displays error string on the form.
 * [routeAfterLogin] - when set, redirects to the route after login.
 * 
 */
import { Component, Output, EventEmitter, Input } from '@angular/core';
import { Router } from '@angular/router';
import { User, _USER_LOGIN, _USER_LOGIN_RESPONSE } from 'angular-backend';
@Component({
  selector: 'login-form-basic',
  templateUrl: './login-form-basic.html'
})
export class LoginFormBasic {
  @Input() displayError: boolean;
  @Input() routeCancel: string;
  @Input() routeAfterLogin: string;

  @Output() login = new EventEmitter<_USER_LOGIN_RESPONSE>();
  @Output() cancel = new EventEmitter<void>();
  @Output() error = new EventEmitter<string>();

  errorString: string = null;
  form: _USER_LOGIN = <_USER_LOGIN>{}
  constructor(
    private router: Router,
    private user: User
  ) { }
  onClickLogin() {
    this.errorString = null;
    this.user.login(this.form).subscribe((res: _USER_LOGIN_RESPONSE) => {
      console.log(res);
      this.login.emit(res);
      if (this.routeAfterLogin) {
        this.router.navigateByUrl(this.routeAfterLogin);
      }
    }, err => {
      let errstr = this.user.getErrorString(err);
      this.error.emit(errstr);
      //this.user.alert(err);
      // console.log( err );
      if (this.displayError) {
        this.errorString = errstr;
      }
    });
  }
  onClickCancel() {
    this.cancel.emit();
    if (this.routeCancel) {
      this.router.navigateByUrl(this.routeCancel);
    }
  }
}
