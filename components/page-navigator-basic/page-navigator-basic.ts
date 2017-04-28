import {Component, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'page-navigator-basic',
  templateUrl: './page-navigator-basic.html',
  styles: [
      `
      `
  ]
})
export class PageNavigatorBasic {

  numbers = [];
  no_of_total_pages = 0;
  currentDisplay = 0;

  @Input() no_of_total_items :number = null;
  @Input() no_of_items_in_one_page:number = null;
  @Input() no_of_pages_in_navigator:number = null;
  @Input() no_of_current_page:number = 1;
  @Input() show_prev_next:boolean = true;
  @Input() show_first_last:boolean = true;

  @Input () text_prev:string  = '&lsaquo;';
  @Input () text_next:string  = '&rsaquo;';
  @Input () text_first:string = '&laquo;';
  @Input () text_last:string  = '&raquo;';

  @Input () structureClass = {
    ul: 'pagination',
    li: 'page-item',
    a: 'page-link',
    active: 'active',
    pageIn: 'page-indicator'
  };

  @Output() pageClick = new EventEmitter();

  constructor() {
    //console.log('pagination::constructor()');
  }

  ngOnChanges(){
    //console.log("ngOnChanges: ...");
    if ( this.no_of_total_items > 0 ) this.showPagination();
  }

  showPagination() {
    //console.log('this.no_of_total_items:', this.no_of_total_items);
    //console.log('this.no_of_items_in_one_page:', this.no_of_items_in_one_page);
    //console.log('this.no_of_pages_in_navigator:', this.no_of_pages_in_navigator);
    this.no_of_total_pages = Math.ceil(this.no_of_total_items / this.no_of_items_in_one_page);

    this.currentDisplay = Math.floor( (this.no_of_current_page -1) / this.no_of_pages_in_navigator);
    this.numbers = [];
    for ( let i = 0; i < this.no_of_pages_in_navigator; i ++ ) {
      let current_page_no = this.currentDisplay  * this.no_of_pages_in_navigator + i;
      let next_block_page_no = ( this.currentDisplay + 1)  * this.no_of_pages_in_navigator;
      if ( current_page_no < this.no_of_total_pages && current_page_no < next_block_page_no ) {
        this.numbers.push( current_page_no + 1 );
      }
    }
    //console.log('numbers: ', this.numbers);
  }
  nextPage(){
    let nextPage = (this.currentDisplay + 1) * this.no_of_pages_in_navigator + 1;
    //console.log('nextPage: ', nextPage);
    this.pageClick.emit( nextPage );
  }
  previousPage(){
    let prevPage = (this.currentDisplay) * this.no_of_pages_in_navigator;
    //console.log('prev: ', prevPage);
    this.pageClick.emit( prevPage );
  }
  gotoPage( page ) {
    //console.log('page: ', page);
    this.pageClick.emit( page );
  }
  gotoLast() {
    this.pageClick.emit( this.no_of_total_pages );
  }
  gotoFirst() {
    this.pageClick.emit( 1 );
  }



}
