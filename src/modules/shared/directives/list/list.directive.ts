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
    this.onAddElement(itemId);
  }

  addList(itemsId: Array<string>, withoutClearing: boolean = false) {
    if(itemsId == null)
      return;

    if (!withoutClearing)
      this.clear();

    itemsId.forEach(async elementId => {
      this.add(elementId);
    });
  }

  remove(itemId: string) {
    if(this.contains(itemId)) {
      this.itemsIdList.splice(this.itemsIdList.indexOf(itemId), 1);
      this.onRemoveElement(itemId);
    }
  }

  contains(itemId: string) {
    return this.itemsIdList.includes(itemId);
  }

  /** gets called for each element added in the list */
  protected onAddElement(_itemId: string) {}

  /** gets called for each element removed from the list */
  protected onRemoveElement(_itemId: string) {}

  // Utils functions

  private clearList() {
    while(this.itemsIdList.length > 0) {
      this.itemsIdList.pop();
    }
  }

}
