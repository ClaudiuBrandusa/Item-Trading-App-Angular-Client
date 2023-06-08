import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { InventoryService } from '../../../inventory/services/inventory.service';
import { EventBusService } from '../../../shared/services/event-bus.service';
import { TradePopupsNames } from '../../enums/trade-popups-names';
import { TradeItem } from '../../models/trade-item';
import { TradesService } from '../../services/trades.service';
import { InventoryItem } from '../../../inventory/models/responses/inventory-item';
import { LockedInventoryItemAmount } from '../../../inventory/models/responses/locked-inventory-item-amount.response';
import { ItemError } from '../../../shared/models/errors/item-error';
import { TradeItemEvents } from '../../enums/trade-item-events';
import { EventBusUtils } from '../../../shared/utils/event-bus.utility';
import { NavigationEvents } from '../../../shared/enums/navigation-events.enum';

@Component({
  selector: 'dialog-set-trade-item-quantity-and-price',
  templateUrl: './set-trade-item-quantity-and-price-dialog.component.html',
  styleUrls: ['./set-trade-item-quantity-and-price-dialog.component.css']
})
export class SetTradeItemQuantityAndPriceDialogComponent implements OnInit, OnDestroy {
  currentTradeItem: TradeItem;
  inventoryItem: InventoryItem;
  lockedItemAmount: LockedInventoryItemAmount;
  errorMessage = "";
  itemDataLoaded = false;
  lockedItemAmountLoaded = false;
  eventId = TradePopupsNames.SetItemQuantityAndPrice;
  private eventBusUtility: EventBusUtils;

  constructor(private fb: FormBuilder, eventBus: EventBusService, private service: TradesService, private inventoryService: InventoryService) {
    this.eventBusUtility = new EventBusUtils(eventBus);
  }

  form = this.fb.group({
    quantity: new FormControl('', [Validators.required, Validators.min(1)]),
    price: new FormControl('', [Validators.required, Validators.min(0)])
  })

  ngOnInit() {
    this.currentTradeItem = this.service.getCurrentTradeItem();
    const quantity = this.currentTradeItem.quantity;
    if (quantity > 0)
      this.form.controls["quantity"].setValue(quantity.toString());
    
    this.form.controls["price"].setValue(this.currentTradeItem.price.toString());
    this.loadData();
  }

  ngOnDestroy() {
    this.eventBusUtility.clearSubscriptions();
  }

  confirm() {
    this.errorMessage = "";
    if (!this.isDataLoaded()) return;

    const quantity = Number(this.form.get('quantity')?.value ?? 1);

    const availableQuantity = this.inventoryItem.quantity - this.lockedItemAmount.lockedAmount;
    if (quantity > availableQuantity) {
      this.errorMessage = `You do not own ${quantity} of ${this.inventoryItem.itemName}.`
      return;
    }
    
    this.currentTradeItem.quantity = quantity;
    this.currentTradeItem.price = Number(this.form.get('price')?.value ?? 0);
    this.service.setCurrentTradeItem(this.currentTradeItem);
    this.eventBusUtility.emit(TradeItemEvents.ConfirmQuantityAndPriceChange, null);
    this.exit();
  }

  cancel() {
    this.eventBusUtility.emit(TradeItemEvents.DenyQuantityAndPriceChange, this.currentTradeItem.id);
    this.exit();
  }

  private isDataLoaded() {
    return this.itemDataLoaded && this.lockedItemAmountLoaded;
  }

  private loadData() {
    this.loadInventoryItemData();
    this.loadLockedItemAmount();
  }

  private exit() {
    this.eventBusUtility.emit(NavigationEvents.ClosePopup, this.eventId);
  }

  private loadInventoryItemData() {
    this.inventoryService.getItem(this.currentTradeItem.id).subscribe({
      next: (response) => {
        this.inventoryItem = response as InventoryItem;
      },
      error: (error: ItemError) => {
        this.errorMessage = error.message;
      },
      complete: () => {
        this.itemDataLoaded = true;
      }
    })
  }

  private loadLockedItemAmount() {
    this.inventoryService.getLockedAmount(this.currentTradeItem.id).subscribe({
      next: (response) => {
        this.lockedItemAmount = response as LockedInventoryItemAmount;
      },
      error: (error: ItemError) => {
        this.errorMessage = error.message;
      },
      complete: () => {
        this.lockedItemAmountLoaded = true;
      }
    })
  }
}
