import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { InventoryService } from '../../../inventory/services/inventory.service';
import { BaseNavigableDialogComponent } from '../../../shared/components/dialog/base-navigable-dialog/base-navigable-dialog.component';
import { EventBusService } from '../../../shared/services/event-bus.service';
import { TradeDialogsEvents } from '../../enums/trade-dialogs-events';
import { TradeEvents } from '../../enums/trade-events';
import { TradeItem } from '../../models/trade-item';
import { TradesService } from '../../services/trades.service';
import { InventoryItem } from '../../../inventory/models/responses/inventory-item';
import { LockedInventoryItemAmount } from '../../../inventory/models/responses/locked-inventory-item-amount.response';
import { ItemError } from '../../../shared/models/errors/item-error';
import { DialogEvents } from '../../../shared/enums/dialog-events.enum';
import { TradeItemEvents } from '../../enums/trade-item-events';

@Component({
  selector: 'dialog-set-trade-item-quantity-and-price',
  templateUrl: './set-trade-item-quantity-and-price-dialog.component.html',
  styleUrls: ['./set-trade-item-quantity-and-price-dialog.component.css']
})
export class SetTradeItemQuantityAndPriceDialogComponent extends BaseNavigableDialogComponent {

  currentTradeItem: TradeItem;
  inventoryItem: InventoryItem;
  lockedItemAmount: LockedInventoryItemAmount;
  errorMessage = "";
  itemDataLoaded = false;
  lockedItemAmountLoaded = false;

  constructor(private fb: FormBuilder, protected eventBus: EventBusService, private service: TradesService, private inventoryService: InventoryService) {
    super(eventBus);
    this.eventId = TradeDialogsEvents.SetItemQuantityAndPrice;
  }

  form = this.fb.group({
    quantity: new FormControl('', [Validators.required, Validators.min(1)]),
    price: new FormControl('', [Validators.required, Validators.min(0)])
  })

  protected override onDisplay() {
    this.currentTradeItem = this.service.getCurrentTradeItem();
    const quantity = this.currentTradeItem.quantity;
    if (quantity > 0)
      this.form.controls["quantity"].setValue(quantity.toString());
    
    this.form.controls["price"].setValue(this.currentTradeItem.price.toString());
    this.loadData();
  }

  protected override onHide() {
    this.form.reset();
    this.errorMessage = "";
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
    this.emit(TradeItemEvents.ConfirmQuantityAndPriceChange, null);
    this.emit(DialogEvents.ClosePopup, this.eventId);
    this.exitDialog();
  }

  cancel() {
    this.emit(TradeItemEvents.DenyQuantityAndPriceChange, this.currentTradeItem.id);
    this.emit(DialogEvents.ClosePopup, this.eventId);
  }

  private isDataLoaded() {
    return this.itemDataLoaded && this.lockedItemAmountLoaded;
  }

  private async loadData() {
    this.loadInventoryItemData();
    this.loadLockedItemAmount();
  }

  private async loadInventoryItemData() {
    (await this.inventoryService.getItem(this.currentTradeItem.id)).subscribe({
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

  private async loadLockedItemAmount() {
    (await this.inventoryService.getLockedAmount(this.currentTradeItem.id)).subscribe({
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
