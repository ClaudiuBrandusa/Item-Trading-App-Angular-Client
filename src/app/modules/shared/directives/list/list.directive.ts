import { Directive } from '@angular/core';

@Directive({
  selector: 'app-list'
})
export abstract class ListDirective {

  private itemsIdList = new Array<string>();
 
  get ItemsIdList() {
    return this.itemsIdList;
  }

  constructor() { }

  // Control methods

  clear() {
    this.clearList();
  }

  add(itemId: string) {
    this.itemsIdList.push(itemId);
  }

  addList(itemsId: Array<string>) {
    if(itemsId == null)
      return;

    this.clear();

    itemsId.forEach(async elementId => {
      this.add(elementId);
    });
  }

  remove(itemId: string) {
    if(this.contains(itemId))
      this.itemsIdList.splice(this.itemsIdList.indexOf(itemId), 0);
  }

  contains(itemId: string) {
    return this.itemsIdList.includes(itemId);
  }

  // Utils functions

  private clearList() {
    while(this.itemsIdList.length > 0) {
      this.itemsIdList.pop();
    }
  }

}
