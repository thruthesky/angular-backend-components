import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
    PostData,
    File,
    NUMBERS,
    _FILE, _POST, _POST_CREATE, _POST_CREATE_RESPONSE,
    _POST_EDIT, _POST_EDIT_RESPONSE
} from 'angular-backend';



@Component({
    selector: 'post-form-basic',
    templateUrl: 'post-form-basic.html'
})
export class PostFormBasic implements OnInit {

    @Output() create = new EventEmitter<_POST>();
    @Output() edit = new EventEmitter<_POST>();
    @Output() cancel = new EventEmitter<void>();

    @Input() post_config_id: string;            // post config id to create. this is only used when create a new post.
    @Input() post = <_POST>{};                  // post data to edit. this is only used when editing.
    @Input() option;

    formGroup: FormGroup;
    files: Array<_FILE> = [];


    /**
     * Options of showing input boxes.
     */
    private default = {
        forumId: false,
        title: true,
        content: true,
        link: false,
        file: true,
        cancel: true
    };
    constructor(
        private fb: FormBuilder,
        public file: File,
        public postData: PostData
    ) {
    }

    ngOnInit() {
        this.option = Object.assign( this.default, this.option );
        this.createForm();
    }
    createForm() {
        if ( this.isCreate() ) {
            this.files = [];
            this.formGroup = this.fb.group({
                post_config_id: [ this.post_config_id ],
                title: [],
                content: [],
                link: [],
                password: [],
            });
        }
        else {
            this.files = this.post.files ? this.post.files : [];
            this.formGroup = this.fb.group({
                title: [ this.post.title ],
                content: [ this.post.content ],
                link: [ this.post.link ],
                password: [],
            });
        }
    }


    onSubmit() {
        if ( this.isCreate() ) this.createPost();
        else this.editPost();
    }


    reset() {
        this.files = [];
        this.formGroup.get('title').patchValue('');
        this.formGroup.get('content').patchValue('');
    }

    createSuccess( post: _POST ) {
        this.reset();
        this.create.emit( post );
    }
    editSuccess( post: _POST ) {
        this.reset();
        this.edit.emit( post );
    }

    onClickCancel() {
        this.cancel.emit();
    }

    /**
     * 
     * Emits the newly created post. Meaning, the post list page should take it and unshift it.
     * 
     */
    createPost() {
        let create = <_POST_CREATE> this.formGroup.value;
        create.file_hooks = this.files.map( (f:_FILE) => f.idx );
        this.postData.create( create ).subscribe( ( res: _POST_CREATE_RESPONSE ) => {
            this.createSuccess( res.data );
            this.formGroup.reset();
        }, err => this.postData.alert( err ) );
    }

    /**
     * After edit, it assigns to original reference. Meaning, it does two-way binding.
     */
    editPost() {
        let edit = <_POST_EDIT> this.formGroup.value;
        edit.idx = this.post.idx;
        edit.file_hooks = this.files.map( (f:_FILE) => f.idx );
        this.postData.edit( edit ).subscribe( ( res: _POST_EDIT_RESPONSE ) => {
            Object.assign( this.post, res.data ); // two-way binding since it is pass-by-reference.
            this.editSuccess( res.data );
        }, err => this.postData.alert( err ) );
    }

    isCreate() {
        return this.post === void 0 || this.post.idx === void 0;
    }
    isEdit() {
        return ! this.isCreate();
    }


}
