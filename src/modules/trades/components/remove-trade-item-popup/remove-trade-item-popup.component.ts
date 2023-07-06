import { Component } from '@angular/core';
import { NavigationService } from '../../../shared/services/navigation.service';
import { TradeItem } from '../../models/trade-item';
import { Store } from '@ngrx/store';
import { selectCurrentTradeItem } from '../../store/trade-item/trade-item.selector';
import { deselectTradeItem, removeTradeItem } from '../../store/trade-item/trade-item.actions';

@Component({
  selector: 'popup-remove-trade-item',
  templateUrl: './remove-trade-item-popup.component.html',
  styleUrls: ['./remove-trade-item-popup.component.css']
})
export class RemoveTradeItemPopupComponent {

  private currentTradeItem: TradeItem;

  constructor(private navigationService: NavigationService, private store: Store<TradeItem>) {
    store.select(selectCurrentTradeItem).subscribe(currentTradeItem => {
      this.currentTradeItem = currentTradeItem;
    });
  }

  confirm() {
    if (!this.currentTradeItem) return;
    this.store.dispatch(removeTradeItem({ ...this.currentTradeItem }));
    this.deselect();
    this.closePopup();
  }

  deny() {
    this.deselect();
    this.closePopup();
  }

  private deselect() {
    this.store.dispatch(deselectTradeItem());
  }

  private closePopup() {
    this.navigationService.closePopup();
  }
}
