import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-trade-item-tags',
  templateUrl: './trade-item-tags.component.html',
  styleUrls: ['./trade-item-tags.component.css']
})
export class TradeItemTagsComponent {
  @Input()
  tradeItemNames = new Array<string>();

  @Input()
  hasRemoveButton = false;

  @Output()
  onRemoveClicked = new EventEmitter<string>();

  remove(itemName) {
    this.onRemoveClicked.emit(itemName);
  }
}
