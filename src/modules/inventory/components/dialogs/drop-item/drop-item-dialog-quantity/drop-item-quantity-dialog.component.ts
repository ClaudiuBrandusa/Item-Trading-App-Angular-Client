import { Component, Output } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { BaseNavigableDialogComponent } from '../../../../../shared/components/dialog/base-navigable-dialog/base-navigable-dialog.component';
import { InventoryDialogEvents } from '../../../../enums/InventoryDialogEvents';
import { InventoryEvents } from '../../../../enums/InventoryEvents';
import { EventBusService } from '../../../../../shared/services/event-bus.service';
import { InventoryService } from '../../../../services/inventory.service';
import { ItemError } from '../../../../../shared/models/errors/item-error';
import { EventData } from '../../../../../shared/utils/event-data';

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
  }

  next() {
    this.service.dropItem(this.form).subscribe({
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

  loadItemName() {
    this.service.getItem(this.service.getSelectedItemId()).subscribe({
      next: (response: any) => {
        this._itemName = response.itemName;
      },
      error: (_error) => {
        this.exitDialog();
      }
    });
  }
}
