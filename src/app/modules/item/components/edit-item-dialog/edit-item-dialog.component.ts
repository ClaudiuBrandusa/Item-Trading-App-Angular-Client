import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Item } from 'src/app/models/response/item/item';
import { EventBusService } from 'src/app/modules/shared/services/event-bus.service';
import { BaseNavigableDialogComponent } from '../../../shared/components/dialog/base-navigable-dialog/base-navigable-dialog.component';
import { ItemDialogEvents } from '../../enums/item-dialog-events';
import { ItemService } from '../../services/item.service';

@Component({
  selector: 'dialog-edit-item',
  templateUrl: './edit-item-dialog.component.html',
  styleUrls: ['./edit-item-dialog.component.css']
})
export class EditItemDialogComponent extends BaseNavigableDialogComponent {

  item: Item = null;

  private getDataSubscription: Subscription;
  private updateItemSubscription: Subscription;
  
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
    this.getDataSubscription = (await this.service.getItem(this.service.getSelectedItemId())).subscribe({
      next: (response) => {
        this.item = response;
        this.form.controls["itemId"].setValue(this.item.id);
        this.form.controls["itemName"].setValue(this.item.name);
        this.form.controls["itemDescription"].setValue(this.item.description);
      },
      error: (error) => {
        console.log('Error at get item found: ', error);
      }
    });
  } 
  
  async submit() {
    this.form.controls["itemId"].setValue(this.item.id);
    this.updateItemSubscription = (await this.service.updateItem(this.form)).subscribe({
      next: (_response) => {
        this.exit();
      },
      error: (error) => {
        console.log('Error at update item found: ', error);
      }
    });
  }

  private exit() {
    this.service.deselect();
    this.exitDialog();
  }

  protected override onHide() {
    this.form.reset();
    this.getDataSubscription?.unsubscribe();
    this.updateItemSubscription?.unsubscribe();
  }

}
