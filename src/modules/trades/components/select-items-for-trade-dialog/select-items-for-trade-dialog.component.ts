import { Component, OnDestroy } from '@angular/core';
import { EventBusService } from '../../../shared/services/event-bus.service';
import { TradeItem } from '../../models/trade-item';
import { TradesService } from '../../services/trades.service';
import { Item } from 'src/modules/item/models/responses/item';
import { InventoryService } from '../../../inventory/services/inventory.service';
import { TradeItemEvents } from '../../enums/trade-item-events';
import { Trade } from '../../models/responses/trade';
import { TradeEvents } from '../../enums/trade-events';
import { EventBusUtils } from '../../../shared/utils/event-bus.utility';
import { NavigationService } from '../../../shared/services/navigation.service';
import { TradePopupsNames } from '../../enums/trade-popups-names';
import { TradeRoutes } from '../../enums/trade-routes';

@Component({
  selector: 'dialog-select-items-for-trade',
  templateUrl: './select-items-for-trade-dialog.component.html',
  styleUrls: ['./select-items-for-trade-dialog.component.css']
})
export class SelectItemsForTradeDialogComponent implements OnDestroy {

  foundItemsId = new Array<string>();
  searchString = "";
  itemsDictionary = new Map<string, Item>();
  tradeValid = false;
  private eventBusUtility: EventBusUtils;

  constructor(eventBus: EventBusService, private service: TradesService, private inventoryService: InventoryService, private navigationService: NavigationService) {
    this.eventBusUtility = new EventBusUtils(eventBus);

    this.eventBusUtility.on(TradeItemEvents.ConfirmQuantityAndPriceChange, () => {
      this.onConfirmQuantityAndPriceChange();
    })

    this.eventBusUtility.on(TradeItemEvents.DenyQuantityAndPriceChange, (itemId: string) => {
      this.onDenyQuantityAndPriceChange(itemId);
    })

    this.eventBusUtility.on(TradeItemEvents.ListChanged, () => {
      this.tradeValid = this.isTradeValid();
    })
  }

  ngOnDestroy() {
    this.eventBusUtility.clearSubscriptions();
    this.service.clearCurrentTradeOffer();
    this.eventBusUtility.emit(TradeItemEvents.Remove, null);
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
    while(this.foundItemsId.length > 0)
      this.foundItemsId.pop();
  }

  exit() {
    this.navigationService.back();
  }

  private listItems() {
    this.inventoryService.list(this.searchString).subscribe({
      next: (response: any) => {
        response.itemsId.forEach(id => {
          if (this.service.isTradeItemIdSelected(id)) return;
          this.foundItemsId.push(id);
        });
      },
      error: (error) => {
        console.log('Error found at list items: ', error);
      }
    })
  }

  select(id: string) {
    // select item id
    if (!this.itemsDictionary.has(id) || this.service.isTradeItemIdSelected(id)) return;
    const item = this.itemsDictionary.get(id);
    const tradeItem = new TradeItem({ id: id, name: item.name })
    this.service.setCurrentTradeItem(tradeItem);
    this.navigationService.openPopup(TradePopupsNames.SetItemQuantityAndPrice);
  }

  onConfirmQuantityAndPriceChange() {
    const tradeItem = this.service.getCurrentTradeItem();
    this.removeItemIdFromFoundItems(tradeItem.id);
    this.eventBusUtility.emit(TradeItemEvents.Add, tradeItem);
  }

  onDenyQuantityAndPriceChange(itemId: string) {
    this.removeSelectedItemId(itemId);
    this.service.setCurrentTradeItem(null);
  }

  onItemLoaded(item: Item) {
    this.itemsDictionary.set(item.id, item);
  }

  createTrade() {
    if (!this.isTradeValid()) return;

    this.service.sendTradeOffer().subscribe({
      next: (response) => {
        const data = response as Trade;
        this.eventBusUtility.emit(TradeEvents.Create, data.tradeId);
        this.navigationService.backToRoute(TradeRoutes.Base);
      },
      error: (error) => {
        console.log(`Error found at sending the trade offer: ${error}`)
      }
    })
  }

  isTradeValid() {
    return this.service.isTradeOfferValid();
  }

  private removeSelectedItemId(itemId: string) {
    this.service.removeItemByIdFromTradeOffer(itemId);
  }

  private removeItemIdFromFoundItems(itemId: string) {
    this.removeElementFromArray(this.foundItemsId, itemId);
  }

  private removeElementFromArray(array: Array<string>, value: string) {
    const index = array.indexOf(value, 0);
    if (index > -1) {
      array.splice(index, 1);
    }
  }
}
