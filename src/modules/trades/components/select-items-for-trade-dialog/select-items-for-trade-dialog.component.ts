import { Component } from '@angular/core';
import { BaseNavigableDialogComponent } from '../../../shared/components/dialog/base-navigable-dialog/base-navigable-dialog.component';
import { EventBusService } from '../../../shared/services/event-bus.service';
import { TradeDialogsEvents } from '../../enums/trade-dialogs-events';
import { TradeItem } from '../../models/trade-item';
import { TradesService } from '../../services/trades.service';
import { Item } from 'src/modules/item/models/responses/item';
import { DialogEvents } from '../../../shared/enums/dialog-events.enum';
import { InventoryService } from '../../../inventory/services/inventory.service';
import { TradeItemEvents } from '../../enums/trade-item-events';
import { Trade } from '../../models/responses/trade';
import { TradeEvents } from '../../enums/trade-events';

@Component({
  selector: 'dialog-select-items-for-trade',
  templateUrl: './select-items-for-trade-dialog.component.html',
  styleUrls: ['./select-items-for-trade-dialog.component.css']
})
export class SelectItemsForTradeDialogComponent extends BaseNavigableDialogComponent {

  foundItemsId = new Array<string>();
  searchString = "";
  itemsDictionary = new Map<string, Item>();
  tradeValid = false;
  loading = true;

  constructor(protected eventBus: EventBusService, private service: TradesService, private inventoryService: InventoryService) {
    super(eventBus);
    this.eventId = TradeDialogsEvents.SelectItems;

    this.on(TradeItemEvents.ConfirmQuantityAndPriceChange, () => {
      this.onConfirmQuantityAndPriceChange();
    })

    this.on(TradeItemEvents.DenyQuantityAndPriceChange, (itemId: string) => {
      this.onDenyQuantityAndPriceChange(itemId);
    })

    this.on(TradeItemEvents.ListChanged, () => {
      this.tradeValid = this.isTradeValid();
    })
  }

  protected override onHide() {
    this.clearResults();
    this.searchString = '';
    this.service.clearCurrentTradeOffer();
    this.emit(TradeItemEvents.Remove, null);
  }

  async search() {
    // we are going to use the list method until we implement the search functionality on the API
    this.clearResults();
    
    if(this.searchString == "") {
      // then we just leave it empty
      return;
    }

    await this.listItems();
  }

  clearResults() {
    while(this.foundItemsId.length > 0)
      this.foundItemsId.pop();
  }

  private async listItems() {
    this.loading = true;
    (await this.inventoryService.list(this.searchString)).subscribe({
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
    this.emit(DialogEvents.OpenAsPopup, TradeDialogsEvents.SetItemQuantityAndPrice);
  }

  onConfirmQuantityAndPriceChange() {
    const tradeItem = this.service.getCurrentTradeItem();
    this.removeItemIdFromFoundItems(tradeItem.id);
    this.emit(TradeItemEvents.Add, tradeItem);
  }

  onDenyQuantityAndPriceChange(itemId: string) {
    this.removeSelectedItemId(itemId);
    this.service.setCurrentTradeItem(null);
  }

  onItemLoaded(item: Item) {
    this.itemsDictionary.set(item.id, item);
  }

  async createTrade() {
    if (!this.isTradeValid()) return;

    (await this.service.sendTradeOffer()).subscribe({
      next: (response) => {
        const data = response as Trade;
        this.emit(TradeEvents.Create, data.tradeId);
        this.exitAllDialogs();
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
