import { Component, Output } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { BaseNavigableDialogComponent } from '../../../../../shared/components/dialog/base-navigable-dialog/base-navigable-dialog.component';
import { InventoryDialogEvents } from '../../../../enums/InventoryDialogEvents';
import { InventoryEvents } from '../../../../enums/InventoryEvents';
import { EventData } from 'src/app/models/utils/event';
import { EventBusService } from '../../../../../shared/services/event-bus.service';
import { InventoryService } from '../../../../services/inventory.service';
import { Subscription } from 'rxjs';
import { ItemError } from '../../../../../../models/errors/item-error';

@Component({
  selector: 'dialog-drop-item-quantity',
  templateUrl: './drop-item-quantity-dialog.component.html',
  styleUrls: ['./drop-item-quantity-dialog.component.css']
})
export class DropItemQuantityDialogComponent extends BaseNavigableDialogComponent {

  _itemName

  @Output()
  get itemName() {
    return this._itemName;
  }

  @Output()
  errorMessage: string;

  private getDataSubscription: Subscription;
  private setQuantitySubscription: Subscription;

  constructor(private fb: FormBuilder, private service: InventoryService, protected eventBus: EventBusService) {
    super(eventBus);
    this.eventId = InventoryDialogEvents.Drop;
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
    this.setQuantitySubscription?.unsubscribe();
  }

  async next() {
    this.setQuantitySubscription = (await this.service.dropItem(this.form)).subscribe({
      next: (_response) => {
        this.errorMessage = '';
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
    this.getDataSubscription = (await this.service.getItem(this.service.getSelectedItemId())).subscribe({
      next: (response: any) => {
        this._itemName = response.itemName;
      },
      error: (_error) => {
        this.exitDialog();
      }
    });
  }
}
