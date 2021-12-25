import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { AddItemRequest } from 'src/app/models/request/inventory/add-item-request.model';
import { BaseDialogComponent } from 'src/app/modules/shared/components/dialog/base-dialog/base-dialog.component';
import { BaseNavigableDialogComponent } from 'src/app/modules/shared/components/dialog/base-navigable-dialog/base-navigable-dialog.component';
import { EventBusService } from 'src/app/modules/shared/services/event-bus.service';
import { NavigationStackService } from 'src/app/modules/shared/services/navigation-stack.service';
import { InventoryDialogEvents } from '../../../../enums/InventoryDialogEvents';
import { InventoryService } from '../../../../services/inventory.service';

@Component({
  selector: 'dialog-add-item-quantity',
  templateUrl: './add-item-quantity-dialog.component.html',
  styleUrls: ['./add-item-quantity-dialog.component.css']
})
export class AddItemQuantityDialogComponent extends BaseNavigableDialogComponent {

  model = new AddItemRequest();

  constructor(private fb: FormBuilder, protected navigationStack: NavigationStackService, private service: InventoryService, protected eventBus: EventBusService) {
    super(eventBus, navigationStack);
    this.eventId = InventoryDialogEvents.AddQuantity;
  }

  form = this.fb.group({
    quantity: new FormControl('', Validators.required)
  })

  protected override onHide() {
    this.form.reset();
  }

  async next() {
    console.log(this.model);
  }

   back() {
    console.log("exit");
    this.exitDialog();
  }

}
