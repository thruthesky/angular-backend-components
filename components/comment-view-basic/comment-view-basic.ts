import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { PostComment,
    _COMMENT,
    _COMMENT_EDIT, _COMMENT_EDIT_RESPONSE,
    _POST,
    _POST_LIST_RESPONSE,
    _VOTE_RESPONSE,
    _REPORT_RESPONSE,
    _DELETE_RESPONSE,
    ID_ANONYMOUS
} from 'angular-backend';

@Component({
    selector: 'comment-view-basic',
    templateUrl: 'comment-view-basic.html',
    styles: [ `
        article {
            background-color: #ddd;
        }
        [depth='0'] { margin-left: 1em }
        [depth='1'] { margin-left: 2em }
        [depth='2'] { margin-left: 3em }
        [depth='3'] { margin-left: 4em }
        [depth='4'] { margin-left: 4em }
        [depth='5'] { margin-left: 4em }
        [depth='6'] { margin-left: 4em }
        [depth='7'] { margin-left: 4em }
        [depth='8'] { margin-left: 4em }
    ` ]
})
export class CommentViewBasic implements OnInit {
    @Input() comment = <_COMMENT>{};

    mode: 'create' | 'edit' | '' = '';
    @Input() post = <_POST>{};
    @Input() list = <_POST_LIST_RESPONSE>{};

    showCommentDeletePassword
    constructor(
        private postComment: PostComment,
        private domSanitizer: DomSanitizer
    ) { }

    ngOnInit() {
        // console.log("this deleted: ", this.comment);
        if ( this.comment.deleted ) {
            this.setDeleted();
        }
    }
    onClickLike( choice ) {
        this.postComment.vote( this.comment.idx, choice ).subscribe( (res:_VOTE_RESPONSE) => {
            console.log('res: ', res);
            this.comment.vote_good = res.data.vote_good;
            this.comment.vote_bad = res.data.vote_bad;
        }, err => this.postComment.alert( err ) );
    }
    onClickReport() {
        this.postComment.report( this.comment.idx ).subscribe( (res:_REPORT_RESPONSE) => {
            console.log('res: ', res);
            this.comment.report = res.data.report;
        }, err => this.postComment.alert( err ) );
    }


    onClickDelete() {
        if ( this.isAnonymousComment() ) {
            this.showCommentDeletePassword = true;
            return;
        }
        this.deleteComment();
    }
    onClickDeleteAnonymous( password ) {
        this.deleteComment( password );
    }
    deleteComment( password? ) {
        let req = { idx: this.comment.idx, password: password };
        console.log(req);
        this.postComment.delete( req ).subscribe( ( res: _DELETE_RESPONSE ) => {
            console.log("onClickDelete() subscribe: res", res);
            this.setDeleted();
        }, err => this.postComment.alert( err ) );
    }



    isAnonymousComment() {
        return this.comment.user.id == ID_ANONYMOUS;
    }



    /**
     * To show buttons.
     */
    get myComment() {
        if ( this.comment.user.id === ID_ANONYMOUS ) return true; //
        return this.comment.user.id == this.postComment.info.id;
    }


    public sanitize( obj ) : string {
        if ( obj === void 0 || obj['content'] === void 0 || ! obj['content'] ) return '';
        let c = obj['content'].replace(/\n/g, "<br>");
        return this.domSanitizer.bypassSecurityTrustHtml( c ) as string;

    }


    setDeleted() {

        this.comment.deleted = 1;
        this.comment.content = "Deleted...";
        this.comment.files = [];
        this.comment.user = <any> {};

        console.log( this.comment );
    }

    onClickEdit() {
        let password = prompt("Input Password");
        let req: _COMMENT_EDIT = {idx: this.comment.idx, password: password};
        this.postComment.edit( req ).subscribe( (res: _COMMENT_EDIT_RESPONSE ) => {
            // password match
            console.log("res: ", res);
            this.mode = 'edit';
        }, e => this.postComment.alert( e ) );
    }
}
