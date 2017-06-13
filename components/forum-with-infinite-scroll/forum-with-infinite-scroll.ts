import { Component, Input } from '@angular/core';
import * as Rx from 'rxjs';
import 'rxjs/add/operator/debounceTime';
import {
    PostData,
    _LIST,
    _POST_LIST_RESPONSE,
    NO_OF_ITEMS_PER_PAGE
} from 'angular-backend';
@Component({
    selector: 'forum-with-infinite-scroll',
    templateUrl: './forum-with-infinite-scroll.html'
})
export class ForumWithInfiniteScroll {

    @Input() post_config_id: string = null;

    lists: Array<_POST_LIST_RESPONSE> = [];

    postListResponse: _POST_LIST_RESPONSE = null;




    showPostForm: boolean = false;

    inLoading = false;
    noMorePosts = false;
    page = 0;
    

    scrollCount: number = 0;
    scrollCountOnDistance: number = 0;
    subscribeWatch;
    constructor(
        private postData: PostData ) {

    }

    ngOnInit() {
        this.load();
        this.subscribeWatch = this.watch('section.posts', 350).subscribe(e => this.load());
    }

    ngOnDestroy() {
        this.subscribeWatch.unsubscribe();
    }

    reset() {
        this.lists = [];
        this.page = 0;
        this.inLoading = false;
        this.noMorePosts = false;
    }
    onLoaded(res: _POST_LIST_RESPONSE) {
        this.postListResponse = res;
    }

    load() {
        if (this.inLoading) {
            return;
        }
        if (this.noMorePosts) {
            return;
        }
        this.inLoading = true;
        this.page++;

        let req: _LIST = {
            where: 'parent_idx=?',
            bind: '0',
            order: 'idx desc',
            page: this.page,
            limit: NO_OF_ITEMS_PER_PAGE,
            extra: {
                post_config_id: this.post_config_id,
                user: true,
                meta: true,
                file: true,
                comment: true
            }
        };

        this.postData.list(req).subscribe((res: _POST_LIST_RESPONSE) => {
            this.inLoading = false;
            this.lists.push(res);
            if (res.data.posts.length == 0) this.noMorePosts = true;
            else {
            }
        }, err => {

            if (err['code'] == -40232) this.postData.alert( err );
            else this.reset();
        });
    }

    watch(selector: string, distance: number = 300): Rx.Observable<any> {


        let element = document.querySelector(selector);
        if (element === void 0 || !element) {
            return;
        }

        return Rx.Observable.fromEvent(document, 'scroll')        // 스크롤은 window 또는 document 에서 발생.
            .debounceTime(100)
            .map((e: any) => {
                this.scrollCount++;
                return e;
            })
            .filter((x: any) => {
                if (element['offsetTop'] === void 0) return false; // @attention this is error handling for some reason, especially on first loading of each forum, it creates "'offsetTop' of undefined" error.

                let elementHeight = element['offsetTop'] + element['clientHeight'];
                let windowYPosition = window.pageYOffset + window.innerHeight;

                if (windowYPosition > elementHeight - distance) { // page scrolled. the distance to the bottom is within 200 px from
                    this.scrollCountOnDistance++;
                    return true;
                }

                return false;
            });

    }

}