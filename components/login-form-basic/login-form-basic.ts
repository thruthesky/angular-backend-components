import { Component, Output, EventEmitter } from '@angular/core';
import { User, _USER_LOGIN, _USER_LOGIN_RESPONSE } from 'angular-backend';
@Component({
  selector: 'login-form-basic',
  templateUrl: './login-form-basic.html'
})
export class LoginFormBasic {
    @Output() login = new EventEmitter<_USER_LOGIN_RESPONSE>();
    @Output() cancel = new EventEmitter<void>();
    @Output() error = new EventEmitter<string>();
  form: _USER_LOGIN = <_USER_LOGIN>{}
  constructor(
    private user: User
  ) { }
  onClickLogin(){

    this.user.login( this.form ).subscribe((res: _USER_LOGIN_RESPONSE) => {
      console.log(res);
      this.login.emit( res );
    }, err => {
        this.error.emit( this.user.getErrorString( err ) );
      //this.user.alert(err);
      console.log(err);
    });
  }
  onClickCancel() {
      this.cancel.emit();
  }
}
