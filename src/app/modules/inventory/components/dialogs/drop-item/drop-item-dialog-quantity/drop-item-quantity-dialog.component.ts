import { Component, Output } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { BaseNavigableDialogComponent } from '../../../../../shared/components/dialog/base-navigable-dialog/base-navigable-dialog.component';
import { InventoryDialogEvents } from '../../../../enums/InventoryDialogEvents';
import { InventoryEvents } from '../../../../enums/InventoryEvents';
import { EventData } from 'src/app/models/utils/event';
import { EventBusService } from '../../../../../shared/services/event-bus.service';
import { InventoryService } from '../../../../services/inventory.service';

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

  constructor(private fb: FormBuilder, private service: InventoryService, protected eventBus: EventBusService) {
    super(eventBus);
    this.eventId = InventoryDialogEvents.Drop;
  }

  form = this.fb.group({
    itemQuantity: new FormControl('', Validators.required)
  })

  protected override onHide() {
    this.form.reset();
  }

  async next() {
    if (await this.service.dropItem(this.form))
      this.eventBus.emit(new EventData(InventoryEvents.Refresh, ''));
    this.exitDialog();
  }

  protected override onDisplay() {
    this.service.getItem(this.service.getSelectedItemId()).then((item) => {
      this._itemName = item.name
    });
  }
}
