import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-navbar-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit {

  @Input()
  placeholder: string = "";

  searchString: string;

  @Output()
  searchFunction = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }

  search() {
    if(this.searchString == null || this.searchString.length == 0)
      return;
    if(this.searchFunction != null)
      this.searchFunction.emit(this.searchString);
  }

}
