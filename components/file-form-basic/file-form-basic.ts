import { Component, Input, NgZone, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
    File,
    _FILE,
    _UPLOAD_RESPONSE, _DELETE_RESPONSE,
    ERROR_NO_FILE_SELECTED
} from 'angular-backend';

@Component({
    selector: 'file-form-basic',
    templateUrl:'./file-form-basic.html',
    styles: [ `
            .file {
                position: relative;
            }
            .file .fa-stack {
                position: absolute;
                bottom: .4em;
                right: .4em;
                cursor: pointer;
            }
            .file .fa-stack .fa-trash {
                color: #454;
            }
    `]
})
export class FileFormBasic implements OnInit {

    @Input() files: Array<_FILE>; // pass-by-reference.
    @Input() form: FormGroup; //

    percentage: number = 0;
    constructor( private file: File, private ngZone: NgZone ) {

    }

    ngOnInit() {
    }

    onChangeFile( _ ) {
        this.percentage = 1;
        this.file.uploadPostFile( _.files[0], percentage => {
            this.percentage = percentage;
            this.ngZone.run( () => {} );
        } ).subscribe( (res:_UPLOAD_RESPONSE) => {
            this.files.push( res.data );
            this.percentage = 0;
        }, err => {
            if ( this.file.isError(err) == ERROR_NO_FILE_SELECTED ) return;
            this.file.alert(err);
        });
    }




    onClickDeleteFile( file ) {
        let req = {
            idx: file.idx,
            password: this.form.get('password').value
        };
        this.file.delete( req ).subscribe( (res:_DELETE_RESPONSE) => {
            let i = this.files.findIndex( (f:_FILE) => f.idx == res.data.idx );
            this.files.splice( i, 1 );
        }, err => this.file.alert(err) );
    }



}