import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.scss']
})
export class SearchBoxComponent {
  @Output() doSearch = new EventEmitter();
  searchKeyword: string = '';
  ngOnInit(): void {
  }

  search(): void {
    this.doSearch.emit(this.searchKeyword);
  }

  clear(): void {
    this.searchKeyword = '';
    this.search();
  }
}
