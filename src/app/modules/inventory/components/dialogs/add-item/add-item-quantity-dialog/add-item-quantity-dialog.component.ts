import { Component, Output } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { AddItemRequest } from 'src/app/models/request/inventory/add-item-request.model';
import { EventBusService } from 'src/app/modules/shared/services/event-bus.service';
import { InventoryDialogEvents } from '../../../../enums/InventoryDialogEvents';
import { InventoryService } from '../../../../services/inventory.service';
import { BaseNavigableDialogComponent } from '../../../../../shared/components/dialog/base-navigable-dialog/base-navigable-dialog.component';
import { EventData } from 'src/app/models/utils/event';
import { InventoryEvents } from '../../../../enums/InventoryEvents';
import { ItemService } from '../../../../../item/services/item.service';
import { Subscription } from 'rxjs';
import { ItemError } from '../../../../../../models/errors/item-error';

@Component({
  selector: 'dialog-add-item-quantity',
  templateUrl: './add-item-quantity-dialog.component.html',
  styleUrls: ['./add-item-quantity-dialog.component.css']
})
export class AddItemQuantityDialogComponent extends BaseNavigableDialogComponent {
  
  model = new AddItemRequest();
  _itemName

  @Output()
  get itemName() {
    return this._itemName;
  }

  @Output()
  errorMessage: string;

  private getDataSubscription: Subscription;
  private addItemQuantitySubscription: Subscription;

  constructor(private fb: FormBuilder, private service: InventoryService, private itemService: ItemService, protected eventBus: EventBusService) {
    super(eventBus);
    this.eventId = InventoryDialogEvents.AddQuantity;
  }

  form = this.fb.group({
    itemQuantity: new FormControl('', Validators.required)
  })

  protected override onDisplay() {
    this.loadItemName();
  }

  protected override onHide() {
    this.form.reset();
    this.errorMessage = '';
    this.service.deselect();

    this.getDataSubscription?.unsubscribe();
    this.addItemQuantitySubscription?.unsubscribe();
  }

  async next() {
    this.addItemQuantitySubscription = (await this.service.addItem(this.form)).subscribe({
      next: (_response) => {
        this.eventBus.emit(new EventData(InventoryEvents.Refresh, ''));
        this.exitDialog();
      },
      error: (error: ItemError) => {
        if (error.errorCode == 400)
          this.errorMessage = error.message;
      }
    });
  }

  async loadItemName() {
    this.getDataSubscription = (await this.itemService.getItem1(this.service.getSelectedItemId())).subscribe({
      next: (response: any) => {
        this._itemName = response.itemName;
      },
      error: (_error) => {
        this.exitDialog();
      }
    });
  }
}
