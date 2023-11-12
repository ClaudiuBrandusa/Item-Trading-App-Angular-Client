import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { TradePopupsNames } from '../../enums/trade-popups-names';
import { TradeItem } from '../../models/trade-item';
import { InventoryItem } from '../../../inventory/models/responses/inventory-item';
import { LockedInventoryItemAmount } from '../../../inventory/models/responses/locked-inventory-item-amount.response';
import { Store } from '@ngrx/store';
import { selectCurrentTradeItem } from '../../store/trade-item/trade-item.selector';
import { selectItemById } from '../../../inventory/store/inventory/inventory.selector';
import { selectLockedAmountById } from '../../../inventory/store/locked-amount/locked-amount.selector';
import { loadInventoryItemLockedAmountInit } from '../../../inventory/store/locked-amount/locked-amount.actions';
import { addTradeItem, deselectTradeItem } from '../../store/trade-item/trade-item.actions';
import { NavigationService } from '../../../shared/services/navigation.service';

@Component({
  selector: 'dialog-set-trade-item-quantity-and-price',
  templateUrl: './set-trade-item-quantity-and-price-dialog.component.html',
  styleUrls: ['./set-trade-item-quantity-and-price-dialog.component.css']
})
export class SetTradeItemQuantityAndPriceDialogComponent implements OnInit {
  currentTradeItem: TradeItem;
  inventoryItem: InventoryItem;
  lockedItemAmount: LockedInventoryItemAmount;
  errorMessage = "";
  eventId = TradePopupsNames.SetItemQuantityAndPrice;

  constructor(private fb: FormBuilder, private navigationService: NavigationService, private store: Store<TradeItem>, inventoryStore: Store<InventoryItem>, private lockedAmountStore: Store<LockedInventoryItemAmount>) {
    store.select(selectCurrentTradeItem).subscribe(currentTradeItem => {
      if (!currentTradeItem) return;
      if (!this.currentTradeItem) {
        inventoryStore.select(selectItemById(currentTradeItem.id)).subscribe(inventoryItem => {
          if (!inventoryItem) return;
          this.inventoryItem = inventoryItem
        });

        lockedAmountStore.select(selectLockedAmountById(currentTradeItem.id)).subscribe(lockedAmount => {
          if (!lockedAmount) return;
          this.lockedItemAmount = lockedAmount;
        });
      }

      this.currentTradeItem = { ...currentTradeItem };
    });
  }

  form = this.fb.group({
    quantity: new FormControl('', [Validators.required, Validators.min(1)]),
    price: new FormControl('', [Validators.required, Validators.min(1)])
  })

  ngOnInit() {
    this.lockedAmountStore.dispatch(loadInventoryItemLockedAmountInit(this.inventoryItem.itemId));

    const quantity = this.currentTradeItem.quantity;
    if (quantity > 0)
      this.form.controls["quantity"].setValue(quantity.toString());
    
    this.form.controls["price"].setValue(this.currentTradeItem.price.toString());
  }

  confirm() {
    this.errorMessage = "";
    if (!this.inventoryItem || !this.currentTradeItem || !this.lockedItemAmount) return;

    const quantity = Number(this.form.get('quantity')?.value ?? 1);

    if (quantity < 1) {
      this.errorMessage = "Unable to set a quantity lower than 1";
      return;
    }

    const availableQuantity = this.inventoryItem.quantity - this.lockedItemAmount.lockedAmount;
    if (quantity > availableQuantity) {
      this.errorMessage = `You do not own ${quantity} of ${this.inventoryItem.itemName}.`
      return;
    }
    
    const price = Number(this.form.get('price')?.value ?? 1);

    if (price < 1) {
      this.errorMessage = "Unable to set a price lower than 1";
      return;
    }
    
    this.currentTradeItem.quantity = quantity;
    this.currentTradeItem.price = price;
    this.store.dispatch(addTradeItem({ ...this.currentTradeItem }));
    this.store.dispatch(deselectTradeItem());
    this.exit();
  }

  cancel() {
    this.exit();
  }

  private exit() {
    this.navigationService.closePopup();
  }
}
