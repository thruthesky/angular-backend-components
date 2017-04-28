import { Component, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import {
    PostData,
    _POST,
    _POST_LIST_RESPONSE,
    _VOTE_RESPONSE,
    _REPORT_RESPONSE
} from 'angular-backend';
@Component({
    selector: 'post-view-basic',
    templateUrl: 'post-view-basic.html'
})
export class PostViewBasic {
    @Input() post: _POST;                       // 'post data' to show in 'view'
    @Input() list: _POST_LIST_RESPONSE;         // whole post list.
    showPostEditForm: boolean = false;
    showCommentForm: boolean = false;

    constructor(
        private postData: PostData,
        private domSanitizer: DomSanitizer
    ) {}

    ngOnInit() {
        // console.log("post-view-basic-component: post: ", this.post);
    }

    onClickLike( choice ) {
        this.postData.vote( this.post.idx, choice ).subscribe( (res:_VOTE_RESPONSE) => {
            console.log('res: ', res);
            this.post.vote_good = res.data.vote_good;
            this.post.vote_bad = res.data.vote_bad;
        }, err => this.postData.alert( err ) );
    }

    onClickReport() {
        this.postData.report( this.post.idx ).subscribe( (res:_REPORT_RESPONSE) => {
            console.log('res: ', res);
            this.post.report = res.data.report;
        }, err => this.postData.alert( err ) );
    }

    get myPost() {
        if ( this.post.user === void 0 ) return false; // 'post data' may not have user information.
        return this.post.user.id == this.postData.info.id;
    }



    public sanitize( obj ) : string {
        if ( obj === void 0 || obj['content'] === void 0 || ! obj['content'] ) return '';
        let c = obj['content'].replace(/\n/g, "<br>");
        return this.domSanitizer.bypassSecurityTrustHtml( c ) as string;
        
    }


}