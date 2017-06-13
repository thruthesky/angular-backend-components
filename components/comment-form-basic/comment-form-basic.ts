import { Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
//import 'rxjs/add/operator/debounceTime';
import {
  PostComment,
  File,
  _POST, _POST_LIST_RESPONSE,
  _COMMENT,
  _FILE,
  _COMMENT_CREATE, _COMMENT_CREATE_RESPONSE,
  _COMMENT_EDIT, _COMMENT_EDIT_RESPONSE,
  _UPLOAD, _UPLOAD_RESPONSE
} from 'angular-backend';
@Component({
  selector: 'comment-form-basic',
  templateUrl: './comment-form-basic.html'
})
export class CommentFormBasic implements OnInit {

  @Input() mode: 'create' | 'edit' = 'create';

  @Input() parent_idx;          /// only for creating comment. it is not used for editing.
  @Input() comment = <_COMMENT>{};   /// only for editing comment.

  @Output() cancel = new EventEmitter<void>();
  @Output() create = new EventEmitter<_COMMENT>();
  @Output() edit = new EventEmitter<_COMMENT>();



  formGroup: FormGroup;
  files: Array<_FILE> = [];


  @Input() post = <_POST>{};                 /// pass-by-reference. Parent post data.
  @Input() list = <_POST_LIST_RESPONSE>{};    /// pass-by-reference. For inserting newly created comment in proper place.

  constructor(
    private fb: FormBuilder,
    public postComment: PostComment,
    private file: File
  ) {
  }

  ngOnInit() {
    this.createForm();
  }

  createForm() {

    if ( this.mode == 'create' ) {
      this.formGroup = this.fb.group({
        content: [],
        password: []
      });
    }
    else {
      this.files = this.comment.files ? this.comment.files : [];
      this.formGroup = this.fb.group({
          content: [ this.comment.content ],
          password: []
      });
    }
  }

  onSubmit() {
    if ( this.mode == 'create' ) this.createComment();
    else this.editComment();
  }
  createComment() {

    let req: _COMMENT_CREATE = {
      parent_idx: this.parent_idx,
      content: this.formGroup.get('content').value,
      password: this.formGroup.get('password').value
    };

    req.file_hooks = this.files.map( (f:_FILE) => f.idx );

    this.postComment.create( req ).subscribe( res => {
      let post = this.post;
      if ( post === void 0 ) return;
      if ( post.comments === void 0 ) post.comments = [];

      let i = post.comments.findIndex( (c: _COMMENT) => c.idx == res.data.parent_idx );
      if ( i == -1 ) post.comments.unshift( res.data );
      else {
        post.comments.splice( i + 1, 0, res.data );
      }

      this.createSuccess( res.data );
    }, err => this.postComment.alert(err) );

  }

  editComment() {

    let req: _COMMENT_EDIT = {
      idx: this.comment.idx,
      content: this.formGroup.get('content').value,
      password: this.formGroup.get('password').value
    };
    req.file_hooks = this.files.map( (f:_FILE) => f.idx );

    this.postComment.edit( req ).subscribe( (res:_COMMENT_EDIT_RESPONSE) => {
      Object.assign( this.comment, res.data ); // two-way binding. pass-by-reference.
      this.editSuccess( res.data );
    }, err => this.postComment.alert( err ));
  }

  reset() {
    this.files = [];
    this.formGroup.get('content').patchValue('');
  }

  createSuccess( comment: _COMMENT ) {
    this.reset();
    this.create.emit( comment );
  }
  editSuccess( comment: _COMMENT ) {
    this.reset();
    this.edit.emit( comment );
  }
  onClickCancel() {
    this.cancel.emit();
  }

}
