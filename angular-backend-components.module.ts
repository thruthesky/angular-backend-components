import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { RouterModule } from '@angular/router';
import { LoginFormBasic } from './components/login-form-basic/login-form-basic';
import { RegisterFormBasic } from './components/register-form-basic/register-form-basic';
import { PasswordChangeFormBasic } from './components/password-change-form-basic/password-change-form-basic';
import { PostFormBasic } from './components/post-form-basic/post-form-basic';
import { PostViewBasic } from './components/post-view-basic/post-view-basic';
import { CommentViewBasic } from './components/comment-view-basic/comment-view-basic';
import { FileFormBasic } from './components/file-form-basic/file-form-basic';
import { ForumWithPageNavigator } from './components/forum-with-page-navigator/forum-with-page-navigator';
import { PageNavigatorBasic } from './components/page-navigator-basic/page-navigator-basic';
import { CommentFormBasic } from './components/comment-form-basic/comment-form-basic';
import { ForumWithInfiniteScroll } from './components/forum-with-infinite-scroll/forum-with-infinite-scroll';
@NgModule({
    declarations: [
        LoginFormBasic,
        RegisterFormBasic,
        PasswordChangeFormBasic,
        PostFormBasic,
        FileFormBasic,
        ForumWithPageNavigator,
        PostViewBasic,
        CommentViewBasic,
        PageNavigatorBasic,
        CommentFormBasic,
        ForumWithInfiniteScroll
    ],
    exports: [
        LoginFormBasic,
        RegisterFormBasic,
        PasswordChangeFormBasic,
        PostFormBasic,
        FileFormBasic,
        ForumWithPageNavigator,
        PostViewBasic,
        CommentViewBasic,
        PageNavigatorBasic,
        CommentFormBasic,
        ForumWithInfiniteScroll
    ],
    imports: [
        CommonModule,
        FormsModule, ReactiveFormsModule
        // RouterModule
    ],
    providers: [  ]
})
export class AngularBackendComponents {

}