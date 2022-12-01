import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { BaseDialogComponent } from 'src/modules/shared/components/dialog/base-dialog/base-dialog.component';
import { EventBusService } from 'src/modules/shared/services/event-bus.service';
import { ItemDialogEvents } from '../../enums/item-dialog-events';
import { ItemEvents } from '../../enums/item-events';
import { ItemService } from '../../services/item.service';

@Component({
  selector: 'dialog-create-item',
  templateUrl: './create-item-dialog.component.html',
  styleUrls: ['./create-item-dialog.component.css']
})
export class CreateItemDialogComponent extends BaseDialogComponent {

  constructor(private fb: FormBuilder, private service: ItemService, protected eventBus: EventBusService) 
  {
    super(eventBus);
    this.eventId = ItemDialogEvents.CreateItem
  }

  form = this.fb.group({
    itemName: new FormControl('', Validators.required),
    itemDescription: new FormControl('', null)
  });

  protected override onHide() {
    this.form.reset();
  }

  async submit() {
    (await this.service.createItem(this.form)).subscribe({
      next: (response: any) => {
        this.emit(ItemEvents.CreateItem, response.itemId.toString());
        this.exitDialog();
      },
      error: (error) => {
        console.log('Error at create item found: ', error);
      }
    });
  }
}
