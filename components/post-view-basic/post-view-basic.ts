import { Component, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import {
    PostData,
    _POST,
    _POST_EDIT, _POST_EDIT_RESPONSE,
    _POST_LIST_RESPONSE,
    _VOTE_RESPONSE,
    _REPORT_RESPONSE,
    _DELETE_REQUEST, _DELETE_RESPONSE,
    ID_ANONYMOUS
} from 'angular-backend';
@Component({
    selector: 'post-view-basic',
    templateUrl: 'post-view-basic.html'
})
export class PostViewBasic {
    @Input() post = <_POST> {};                       // 'post data' to show in 'view'
    @Input() list = <_POST_LIST_RESPONSE> {};         // whole post list.
    showPostEditForm: boolean = false;
    showCommentForm: boolean = false;
    showPostDeletePasswordForm: boolean = false;

    constructor(
        private postData: PostData,
        private domSanitizer: DomSanitizer
    ) {}

    ngOnInit() {
        if ( this.post.deleted ) {
            this.setDeleted();
        }
    }

    onClickLike( choice ) {
        this.postData.vote( this.post.idx, choice ).subscribe( (res:_VOTE_RESPONSE) => {
            this.post.vote_good = res.data.vote_good;
            this.post.vote_bad = res.data.vote_bad;
        }, err => this.postData.alert( err ) );
    }

    onClickReport() {
        this.postData.report( this.post.idx ).subscribe( (res:_REPORT_RESPONSE) => {
            this.post.report = res.data.report;
        }, err => this.postData.alert( err ) );
    }


    onClickDelete() {
        if ( this.isAnonymousPost() ) {
            this.showPostDeletePasswordForm = true;
            return;
        }
        this.deletePost();
    }
    onClickDeleteAnonymous( password ) {
        this.deletePost( password );
    }
    deletePost( password? ) {
        let req = { idx: this.post.idx, password: password };
        this.postData.delete( req ).subscribe( ( res: _DELETE_RESPONSE ) => {
            this.setDeleted();
        }, err => this.postData.alert( err ) );
    }

    /**
     * To show buttons.
     */
    get myPost() {
        if ( this.post.user === void 0 ) return false; // 'post data' may not have user information.
        if ( this.post.user.id === ID_ANONYMOUS ) return false; //
        return this.post.user.id == this.postData.info.id;
    }


    get anonymousPost() {
        return this.isAnonymousPost();
    }

    isAnonymousPost() {
        return this.post.user.id == ID_ANONYMOUS;
    }


    setDeleted() {
        this.post.deleted = 1;
        this.post.title = "Deleted...";
        this.post.content = "Deleted...";
        this.post.files = [];
        this.post.user = <any> {};
    }

    /**
     * 
     * Is this only for 'content'?
     * 
     * @param obj
     */
    sanitize( obj ) : string {
        if ( obj === void 0 || obj['content'] === void 0 || ! obj['content'] ) return '';
        let c = obj['content'].replace(/\n/g, "<br>");
        return this.domSanitizer.bypassSecurityTrustHtml( c ) as string;
    }

    onClickEdit() {
        if ( this.myPost ) {
            this.showPostEditForm = true;
            return;
        }
        let password = prompt("Input Password");
        let req: _POST_EDIT = { idx: this.post.idx, password: password };
        this.postData.edit( req ).subscribe( (res: _POST_EDIT_RESPONSE ) => {
            // password match
            this.showPostEditForm = true;
        }, e => this.postData.alert( e ) );
    }
}