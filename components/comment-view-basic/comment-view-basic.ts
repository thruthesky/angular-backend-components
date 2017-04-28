import { Component, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { PostComment,
    _COMMENT,
    _POST,
    _POST_LIST_RESPONSE,
    _VOTE_RESPONSE,
    _REPORT_RESPONSE
} from 'angular-backend';

@Component({
    selector: 'comment-view-basic',
    templateUrl: 'comment-view-basic.html'
})
export class CommentViewBasic {
    @Input() comment: _COMMENT;

    mode: 'create' | 'edit' | '' = '';
    @Input() post: _POST;
    @Input() list: _POST_LIST_RESPONSE;
    constructor(
        private postComment: PostComment,
        private domSanitizer: DomSanitizer
    ) { }
    
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



    get myComment() {
        return this.comment.user.id == this.postComment.info.id;
    }


    public sanitize( obj ) : string {
        if ( obj === void 0 || obj['content'] === void 0 || ! obj['content'] ) return '';
        let c = obj['content'].replace(/\n/g, "<br>");
        return this.domSanitizer.bypassSecurityTrustHtml( c ) as string;
        
    }

}