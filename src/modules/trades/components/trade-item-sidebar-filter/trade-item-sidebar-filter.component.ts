import { Component, EventEmitter, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectItemNames } from '../../../item/store/item/item.selector';
import { searchItemByNameInit } from '../../../item/store/item/item.actions';

@Component({
  selector: 'app-trade-item-sidebar-filter',
  templateUrl: './trade-item-sidebar-filter.component.html',
  styleUrls: ['./trade-item-sidebar-filter.component.css']
})
export class TradeItemSidebarFilterComponent {

  @Output()
  selectedTradeItems = new EventEmitter<Array<string>>();
  
  selectedTradeItemsList = new Array();
  itemSearchString = "";
  displaySearchResults = false;
  searching = false;
  foundItems = new Map<string, string>();

  constructor(private store: Store) {
    store.dispatch(searchItemByNameInit(this.itemSearchString));

    store.select(selectItemNames).subscribe((itemNames : Map<string, string>) => {
      this.foundItems.clear();
      Object.keys(itemNames!).filter(itemName => itemName.toLowerCase().startsWith(this.itemSearchString.toLowerCase())).forEach(item => this.foundItems.set(item, itemNames[item]));
    });
  }

  search() {
    if (this.itemSearchString.length == 0) {
      this.displaySearchResults = false;
      return;
    }

    this.displaySearchResults = true;
    this.searching = true;
    this.searchItem(this.itemSearchString);
    this.searching = false;
  }

  removeElement(itemName, emit = true) {
    const index = this.selectedTradeItemsList.findIndex(x => x == itemName);
    if (index == -1) return;
    this.selectedTradeItemsList.splice(index, 1);
    emit && this.selectedTradeItems.emit(this.selectedTradeItemsList.map(item => this.foundItems.get(item)!));
  }

  isSelected(itemName) {
    return this.selectedTradeItemsList.includes(itemName);
  }

  click(itemName) {
    if (this.isSelected(itemName)) {
      this.deselect(itemName);
    } else {
      this.select(itemName);
    }
    
    this.selectedTradeItems.emit(this.selectedTradeItemsList.map(item => this.foundItems.get(item)!));
  }

  clear() {
    this.itemSearchString = "";
    this.search();
  }

  get length() {
    return this.foundItems.size;
  }

  private select(itemName) {
    this.selectedTradeItemsList.push(itemName);
  }

  private deselect(itemName) {
    this.removeElement(itemName, false);
  }

  private searchItem(itemName) {
    this.store.dispatch(searchItemByNameInit(itemName));
  }
}
