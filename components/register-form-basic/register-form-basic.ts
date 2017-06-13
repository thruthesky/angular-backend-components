import { Component, Input, Output, EventEmitter, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';



import {
  User,
  File,
  _RESPONSE,
  _USER_DATA_RESPONSE,
  _USER_CREATE,
  _USER_EDIT,
  _USER_EDIT_RESPONSE,
  _DELETE_RESPONSE,
  _USER_RESPONSE,
  ERROR_WRONG_SESSION_ID_NO_USER_DATA_BY_THAT_SESSION_ID

} from 'angular-backend';



type u = _USER_RESPONSE;

@Component({
  selector: 'register-form-basic',
  templateUrl: './register-form-basic.html'
})
export class RegisterFormBasic {

  @Input() displayError: boolean;
  @Input() routeCancel: string;
  @Input() routeAfterRegister: string;

  @Output() cancel = new EventEmitter<void>();
  @Output() register = new EventEmitter<void>();
  @Output() update = new EventEmitter<void>();
  @Output() error = new EventEmitter<string>();

  data = <u>{};

  form: FormGroup;
  percentage: number = 0;

  errorString: string = null;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    public user: User,
    private ngZone: NgZone,
    //private router: Router,
    private file: File) {



    this.form = fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(32)]],
      email: ['', [Validators.required, this.emailValidator]],
      mobile: [],
      gender: [],
      birthday: []
    });

    if (!this.user.logged) {
      this.form.addControl('id', new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(32)]));
      this.form.addControl('password', new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(128)]));
    }

    this.form.valueChanges
      //.debounceTime( 500 )
      .subscribe(res => this.onValueChanged(res));


    if (this.user.logged) this.loadUserData();


  }

  emailValidator(c: AbstractControl): { [key: string]: any } {
    if (!c.value) return;
    if (c.value.length < 8) {
      return { 'minlength': '' };
    }
    if (c.value.length > 64) {
      return { 'maxlength': '' };
    }
    let re = new RegExp(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/).test(<string>c.value);
    if (re) return;
    else return { 'malformed': '' };
  }

  formErrors = {
    id: '',
    password: '',
    name: '',
    email: ''
  };

  validationMessages = {
    id: {
      'required': 'ID is required.',
      'minlength': 'ID must be at least 3 characters long.',
      'maxlength': 'ID cannot be more than 32 characters long.'
    },
    name: {
      'required': 'Name is required.',
      'minlength': 'Name must be at least 3 characters long.',
      'maxlength': 'Name cannot be more than 32 characters long.'
    },
    password: {
      'required': 'Password is required.',
      'minlength': 'Password must be at least 5 characters long.',
      'maxlength': 'Password cannot be more than 128 characters long.'
    },
    email: {
      'required': 'Email is required.',
      'minlength': 'Email must be at least 8 characters long.',
      'maxlength': 'Email cannot be more than 32 characters long.',
      'malformed': 'Email must be in valid format. valudator error'
    }

  };

  onValueChanged(data?: any) {
    if (!this.form) return;
    const form = this.form;
    for (const field in this.formErrors) {
      this.formErrors[field] = '';        // clear previous error message (if any)
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }


  loadUserData() {
    this.user.data().subscribe((res: _USER_DATA_RESPONSE) => {
      this.data = res.data.user;
      this.data = this.user.composeBirthday(this.data);
      this.form.patchValue(this.data);
    }, (err: _RESPONSE) => {
      if (err.code == ERROR_WRONG_SESSION_ID_NO_USER_DATA_BY_THAT_SESSION_ID) {
        this.user.deleteSessionInfo();
        alert("WARNING: Your login had invalidated. Please login again.");
      }
      else {
        this.doError(err);
      }
    });
  }



  /**
   * 
   * Upload/Replace user's profile photo.
   * 
   * 
   * @param _ HTML FORM INPUT type=file element.
   */
  onChangeFileUpload(_) {
    this.file.uploadPrimaryPhoto(_.files[0], p => {
      this.percentage = p;
      this.ngZone.run(() => { });
    })
      .subscribe(res => {
        (<u>this.data).primary_photo = res.data;
        this.percentage = 0;
      }, err => {
        this.percentage = 0;
        this.doError(err);
      });
  }



  /**
   * @see readme#registration
   */
  onClickRegister() {
    let register = this.user.splitBirthdays(<_USER_CREATE>this.form.value);
    if ((<u>this.data).primary_photo) register.file_hooks = [(<u>this.data).primary_photo.idx];
      this.user.register(register).subscribe(res => {
      this.register.emit();
      if (this.routeAfterRegister) {
        this.router.navigateByUrl(this.routeAfterRegister);
      }
    }, err => {
      this.doError(err);
    });
  }

  onClickUpdate() {
    let edit = this.user.splitBirthdays(<_USER_EDIT>this.form.value);
    if (edit['id'] !== void 0) delete edit['id'];
    if (edit['password'] !== void 0) delete edit['password'];
    this.user.edit(edit).subscribe((res: _USER_EDIT_RESPONSE) => {
      this.update.emit();
      if (this.routeAfterRegister) {
        this.router.navigateByUrl(this.routeAfterRegister);
      }
    }, err => {
      this.doError(err);
    });
  }


  onClickDeletePhoto() {
    this.file.delete((<u>this.data).primary_photo.idx).subscribe((res: _DELETE_RESPONSE) => {
      (<u>this.data).primary_photo = <any>{};
    }, err => {
      this.doError(err);
    });
  }

  onClickCancel() {
    this.cancel.emit();
    if (this.routeCancel) {
      this.router.navigateByUrl(this.routeCancel);
    }
  }


  doError(err) {
    let errstr = this.user.getErrorString(err);
    this.error.emit(errstr);
    if (this.displayError) {
      this.errorString = errstr;
    }
  }
}
