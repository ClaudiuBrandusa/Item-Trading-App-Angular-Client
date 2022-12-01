import { Directive, Input } from '@angular/core';

@Directive({
  selector: 'list-item'
})
export abstract class ListItemDirective {
  
  protected itemId = "";

  @Input()
  set ItemId(value: string) {
    this.itemId = value;
    this.onSetItemId();
    this.loadData();
  }
  
  constructor() { }

  // called on item id set
  protected abstract onSetItemId();

  // data loading logic
  protected abstract loadData();
}
