import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { AddItemRequest } from 'src/app/models/request/inventory/add-item-request.model';
import { EventBusService } from 'src/app/modules/shared/services/event-bus.service';
import { InventoryDialogEvents } from '../../../../enums/InventoryDialogEvents';
import { InventoryService } from '../../../../services/inventory.service';
import { BaseNavigableDialogComponent } from '../../../../../shared/components/dialog/base-navigable-dialog/base-navigable-dialog.component';

@Component({
  selector: 'dialog-add-item-quantity',
  templateUrl: './add-item-quantity-dialog.component.html',
  styleUrls: ['./add-item-quantity-dialog.component.css']
})
export class AddItemQuantityDialogComponent extends BaseNavigableDialogComponent {

  model = new AddItemRequest();

  constructor(private fb: FormBuilder, private service: InventoryService, protected eventBus: EventBusService) {
    super(eventBus);
    this.eventId = InventoryDialogEvents.AddQuantity;
  }

  form = this.fb.group({
    itemQuantity: new FormControl('', Validators.required)
  })

  protected override onHide() {
    this.form.reset();
  }

  async next() {
    await this.service.addItem(this.form);
    this.exitDialog();
  }
}
