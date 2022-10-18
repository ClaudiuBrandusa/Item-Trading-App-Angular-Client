import { Component } from '@angular/core';
import { Item } from 'src/app/models/response/item/item';
import { Interval } from 'src/app/models/utils/async-utils';
import { BaseDialogComponent } from 'src/app/modules/shared/components/dialog/base-dialog/base-dialog.component';
import { EventBusService } from 'src/app/modules/shared/services/event-bus.service';
import { ItemDialogEvents } from '../../enums/item-dialog-events';
import { ItemService } from '../../services/item.service';

@Component({
  selector: 'dialog-delete-item',
  templateUrl: './delete-item-dialog.component.html',
  styleUrls: ['./delete-item-dialog.component.css']
})
export class DeleteItemDialogComponent extends BaseDialogComponent {
  
  item: Item = null;

  get itemName() {
    return this.item == null ? "" : this.item.name;
  }

  constructor(private service: ItemService, protected eventBus: EventBusService) {
    super(eventBus);
    this.eventId = ItemDialogEvents.DeleteItem
  }
  
  protected override async onDisplay() {
    this.item = await this.service.getItem(this.service.getSelectedItemId());
  } 

  // response functions

  async delete() {
    await Interval(() => this.item == null, 10, 1000);

    await this.service.deleteItem(this.item.id);

    this.exit();
  }

  cancel() {
    this.exit();
  }

  private exit() {
    this.service.deselect();
    this.exitDialog();
  }
}
