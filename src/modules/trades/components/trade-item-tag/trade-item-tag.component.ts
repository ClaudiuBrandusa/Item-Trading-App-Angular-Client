import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-trade-item-tag',
  templateUrl: './trade-item-tag.component.html',
  styleUrls: ['./trade-item-tag.component.css']
})
export class TradeItemTagComponent {
  @Input()
  itemName: string;
}
