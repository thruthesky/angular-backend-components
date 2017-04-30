# angular-backend-components
Angular Backend Components


# Todo

* edit after password match for anonymous edit.
  * it is secure, that an anonymous cannot update files, even if password not match because an anonymouse cannot update 'file.finish' unless password match.

* uploaded photo(file) delete



# Installaton

Inside Angular project,

````
$ git submodule add https://github.com/thruthesky/angular-backend-components src/angular-backend-components
````


# Tips


* Anonymous can post / edit / delete.




# How to use

app.module.ts
````
import { AngularBackendModule } from 'angular-backend';
import { AngularBackendComponents } from '../angular-backend-components/angular-backend-components.module';
    AngularBackendModule.forRoot(),
    AngularBackendComponents
````

app.component.ts
````
import { Component } from '@angular/core';
import { User } from 'angular-backend';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app works!';
  view: string = 'forum-infinite';
  constructor( public user: User ) {
    user.setBackendUrl('http://backend.org/index.php');
  }
  onError( str ) {
    alert( str );
  }
}
````

app.component.html
````
<div class="page p-2">
  <h1>
    {{title}}
  </h1>
  <div *ngIf=" user.logged ">
    Welcome, {{ user.info.id }}.
  </div>
  <nav class="my-2">
    <button type="button" (click)=" view = 'home' ">Home</button>
    <button *ngIf=" ! user.logged " type="button" (click)=" view='login' ">Login</button>
    <button *ngIf=" user.logged " type="button" (click)=" view='home'; user.logout() ">Logout</button>
    <button *ngIf=" ! user.logged " type="button" (click)=" view='register' ">Register</button>
    <button *ngIf=" user.logged " type="button" (click)=" view='register' ">Profile Update</button>
    <button *ngIf=" user.logged " type="button" (click)=" view='password' ">Password Update</button>
    <button type="button" (click)=" view='forum' ">Forum</button>
    <button type="button" (click)=" view='forum-infinite' ">Forum (Infinite)</button>
  </nav>
  <div *ngIf=" view == 'home' ">
    <h2>Home</h2>
  </div>
  <login-form-basic *ngIf=" view == 'login' " (login)=" view = 'home' " (error)=" onError($event) ">
  </login-form-basic>
  <register-form-basic *ngIf=" view == 'register' ">
  </register-form-basic>
  <password-change-form-basic *ngIf=" view == 'password' " (update)=" view = 'home' ">
  </password-change-form-basic>

  <forum-with-page-navigator *ngIf=" view == 'forum' " [post_config_id]=" 'test' "></forum-with-page-navigator>
  <forum-with-infinite-scroll *ngIf=" view == 'forum-infinite' " [post_config_id]=" 'test' "></forum-with-infinite-scroll>
</div>
````
