import { Component, OnDestroy, OnInit } from '@angular/core';
import { TradeItem } from '../../models/trade-item';
import { Trade } from '../../models/responses/trade';
import { NavigationService } from '../../../shared/services/navigation.service';
import { TradePopupsNames } from '../../enums/trade-popups-names';
import { TradeRoutes } from '../../enums/trade-routes';
import { Store } from '@ngrx/store';
import { removeTradeReceiver, sendTradeOfferInit } from '../../store/trade/trade.actions';
import { Observable } from 'rxjs';
import { InventoryItem } from '../../../inventory/models/responses/inventory-item';
import { selectInventoryItemIdsThatAreNotSelectedAsTradeItems, selectInventoryItemsData } from '../../../inventory/store/inventory/inventory.selector';
import { clearSearchedItems, loadItemsInit } from '../../../inventory/store/inventory/inventory.actions';
import { discardTradeItems, selectTradeItem } from '../../store/trade-item/trade-item.actions';
import { selectTradeItems } from '../../store/trade-item/trade-item.selector';
import { selectTradeOfferReceiverId } from '../../store/trade/trade.selector';
import { TradeOfferRequest } from '../../models/requests/trade-offer.request';
import { clearArray } from '../../../shared/utils/array-utils';

@Component({
  selector: 'dialog-select-items-for-trade',
  templateUrl: './select-items-for-trade-dialog.component.html',
  styleUrls: ['./select-items-for-trade-dialog.component.css']
})
export class SelectItemsForTradeDialogComponent implements OnInit, OnDestroy {

  foundItems = new Array<InventoryItem>();
  foundItemIds$: Observable<string[]>;
  selectedTradeItems = new Array<TradeItem>();
  private tradeOfferReceiverId: string;
  searchString = "";
  
  constructor(private navigationService: NavigationService, private inventoryStore: Store<InventoryItem>, private store: Store<Trade>, private tradeItemStore: Store<TradeItem>) {
    this.foundItemIds$ = this.inventoryStore.select(selectInventoryItemIdsThatAreNotSelectedAsTradeItems);
    this.inventoryStore.select(selectInventoryItemsData).subscribe(inventoryItems => {
      if (!inventoryItems) return;
      this.foundItems = inventoryItems;
    });

    store.select(selectTradeOfferReceiverId).subscribe(receiverId => {
      if (!receiverId) return;
      this.tradeOfferReceiverId = receiverId;
    });

    tradeItemStore.select(selectTradeItems).subscribe(tradeItems => {
      clearArray(this.selectedTradeItems);
      tradeItems.forEach(tradeItem => tradeItem && this.selectedTradeItems.push(tradeItem));
    });
  }

  ngOnInit() {
    this.search();
  }

  ngOnDestroy() {
    this.tradeItemStore.dispatch(discardTradeItems());
  }

  search() {
    // we are going to use the list method until we implement the search functionality on the API
    this.clearResults();
    
    if(this.searchString == "") {
      // then we just leave it empty
      return;
    }

    this.listItems();
  }

  clearResults() {
    this.inventoryStore.dispatch(clearSearchedItems());
  }

  exit() {
    this.clearResults();
    this.store.dispatch(removeTradeReceiver());
    this.navigationService.back();
  }

  private listItems() {
    this.inventoryStore.dispatch(loadItemsInit(this.searchString));
  }

  select(id: string) {
    // select item id
    const item = this.foundItems.find(item => item.itemId === id);
    if (!item) return;
    const tradeItem = new TradeItem({ id: id, name: item.itemName });
    this.tradeItemStore.dispatch(selectTradeItem(tradeItem));
    this.navigationService.openPopup(TradePopupsNames.SetItemQuantityAndPrice);
  }

  createTrade() {
    if (!this.isTradeValid()) return;

    this.store.dispatch(sendTradeOfferInit(new TradeOfferRequest({ targetUserId: this.tradeOfferReceiverId, items: [ ...this.selectedTradeItems ]})));
    this.store.dispatch(removeTradeReceiver());
    
    this.navigationService.backToRoute(TradeRoutes.Base);
  }

  isTradeValid() {
    return this.tradeOfferReceiverId && this.selectedTradeItems.length > 0;
  }
}
