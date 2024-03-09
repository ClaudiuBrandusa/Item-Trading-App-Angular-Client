import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'default-page',
  templateUrl: './default-page.component.html',
  styleUrls: ['./default-page.component.css']
})
export class DefaultPageComponent {
  @Input()
  hasSearchBar = true;
  @Input()
  hasCustomSearchBar = false;
  @Input()
  searchInputPlaceholder = "";
  @Input()
  hasMainContainer = true;

  @Output()
  onSearch = new EventEmitter<string>();

  search(searchBody) {
    this.onSearch.emit(searchBody.searchString);
  }

  getEventValue(event: Event) {
    let str = event as unknown as string;
    if(str != null)
      return str;
    return (event.target as HTMLInputElement).value;
  }
}
