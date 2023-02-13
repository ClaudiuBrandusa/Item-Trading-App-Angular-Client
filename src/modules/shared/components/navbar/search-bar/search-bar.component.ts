import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-navbar-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit {

  @Input()
  placeholder: string = "";

  @Input()
  filteringOptions: Array<string>;

  @Input()
  allowEmptySearch = false;

  searchString: string;

  hasFiltering: boolean = false;

  @Output()
  searchFunction = new EventEmitter<any>();

  selectedFilterValue: string;

  constructor() { }

  ngOnInit(): void {
    if (this.filteringOptions) {
      this.hasFiltering = true;
      this.selectedFilterValue = this.filteringOptions[0];
    }
  }

  search() {
    if (!this.allowEmptySearch)
      if (this.searchString == null || this.searchString.length == 0)
        return;
    if (this.searchFunction != null) {
      const body : any = { searchString: this.searchString };
      if (this.selectedFilterValue)
        body.filter = this.selectedFilterValue;

      this.searchFunction.emit(body);
    }
  }
}
