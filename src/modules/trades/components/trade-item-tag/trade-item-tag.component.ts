import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-trade-item-tag',
  templateUrl: './trade-item-tag.component.html',
  styleUrls: ['./trade-item-tag.component.css']
})
export class TradeItemTagComponent {
  @Input()
  itemName: string;

  @Input()
  hasRemoveButton = false;

  @Output()
  onRemoveClicked = new EventEmitter<string>();

  remove() {
    this.onRemoveClicked.emit(this.itemName);
  }
}
