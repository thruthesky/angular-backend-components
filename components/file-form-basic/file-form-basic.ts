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
        console.log("form: ", this.form);
    }

    onChangeFile( _ ) {
        this.percentage = 1;
        this.file.uploadPostFile( _.files[0], percentage => {
            console.log('percentage:', percentage);
            this.percentage = percentage;
            this.ngZone.run( () => {} );
        } ).subscribe( (res:_UPLOAD_RESPONSE) => {
            this.files.push( res.data );
            console.log('files: ', this.files);
            this.percentage = 0;
        }, err => {
            console.log('err:', err);
            if ( this.file.isError(err) == ERROR_NO_FILE_SELECTED ) return;
            this.file.alert(err);
        });
    }




    onClickDeleteFile( file ) {
        let req = {
            idx: file.idx,
            password: this.form.get('password').value
        };
        console.log("FileFormComponent::onClickDeleteFile(file): ", file, this.form);
        this.file.delete( req ).subscribe( (res:_DELETE_RESPONSE) => {
            console.log("file delete: ", res);
            let i = this.files.findIndex( (f:_FILE) => f.idx == res.data.idx );
            // Object.assign( this.files, files );

            this.files.splice( i, 1 );

            console.log('files: ', this.files);
        }, err => this.file.alert(err) );
    }



}