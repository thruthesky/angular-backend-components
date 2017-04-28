import { Component, Input } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/debounceTime';
import {
  PostData,
  _LIST,
  _POST_LIST_RESPONSE,
  NO_OF_ITEMS_PER_PAGE
} from 'angular-backend';

@Component({
  selector: 'forum-with-page-navigator',
  templateUrl: './forum-with-page-navigator.html',
  styles: [
    `
      `
  ]
})
export class ForumWithPageNavigator {

  @Input() post_config_id: string = null;

  list: _POST_LIST_RESPONSE;

  postListResponse: _POST_LIST_RESPONSE = null;

  showPostForm: boolean = false;


  constructor(
    // private activated: ActivatedRoute,
    private postData: PostData) {

  }

  ngOnInit() {
    this.load();
    // this.activated.params.subscribe( params => {
    //   if ( params['post_config_id'] !== void 0 ) {
    //     this.post_config_id = params['post_config_id'];

    //     this.load();
    //   }
    // });
  }

  onLoaded(res: _POST_LIST_RESPONSE) {
    this.postListResponse = res;

    console.log('res:', res);

  }


  onPageClick(page) {
    console.log('onPageClick::page : ', page);

    this.load({
      page: page
    });
  }


  load(_: _LIST = {}) {

    let req: _LIST = {
      where: 'parent_idx=?',
      bind: '0',
      order: 'idx desc',
      page: _.page ? _.page : 1,
      limit: _.limit ? _.limit : NO_OF_ITEMS_PER_PAGE,
      extra: {
        post_config_id: this.post_config_id,
        user: true,
        meta: true,
        file: true,
        comment: true
      }
    };

    this.postData.list(req).subscribe((res: _POST_LIST_RESPONSE) => {
      console.log('forum-with-page-navigator: post list: ', res);
      this.list = res;
    }, err => this.postData.alert(err));
  }


}