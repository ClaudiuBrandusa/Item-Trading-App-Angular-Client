import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Item } from 'src/app/models/response/item/item';
import { BaseDialogComponent } from 'src/app/modules/shared/components/dialog/base-dialog/base-dialog.component';
import { EventBusService } from 'src/app/modules/shared/services/event-bus.service';
import { ItemDialogEvents } from '../../enums/item-dialog-events';
import { ItemService } from '../../services/item.service';

@Component({
  selector: 'dialog-edit-item',
  templateUrl: './edit-item-dialog.component.html',
  styleUrls: ['./edit-item-dialog.component.css']
})
export class EditItemDialogComponent extends BaseDialogComponent {

  item: Item = null;
  
  constructor(private fb: FormBuilder, private service: ItemService, protected eventBus: EventBusService) 
  {
    super(eventBus);
    this.eventId = ItemDialogEvents.EditItem
  }

  form = this.fb.group({
    itemId: new FormControl('', Validators.required),
    itemName: new FormControl('', Validators.required),
    itemDescription: new FormControl('', null)
  })
  
  protected override async onDisplay() {
    this.item = await this.service.getItem(this.service.getSelectedItemId());
    this.form.controls["itemId"].setValue(this.item.id);
    this.form.controls["itemName"].setValue(this.item.name);
    this.form.controls["itemDescription"].setValue(this.item.description);
  } 
  
  async submit() {
    this.form.controls["itemId"].setValue(this.item.id);
    await this.service.updateItem(this.form);
    this.exit();
  }

  cancel(event: Event) {
    event.preventDefault();
    this.exit();
  }

  private exit() {
    this.service.deselect();
    this.exitDialog();
  }

  protected override onHide() {
    this.form.reset();
  }

}
