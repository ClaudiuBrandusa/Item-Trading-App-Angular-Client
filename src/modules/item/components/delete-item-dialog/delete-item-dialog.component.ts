import { Component } from '@angular/core';
import { Item } from 'src/modules/item/models/responses/item';
import { EventBusService } from 'src/modules/shared/services/event-bus.service';
import { BaseNavigableDialogComponent } from '../../../shared/components/dialog/base-navigable-dialog/base-navigable-dialog.component';
import { Interval } from '../../../shared/utils/async-utils';
import { EventData } from '../../../shared/utils/event-data';
import { ItemDialogEvents } from '../../enums/item-dialog-events';
import { ItemEvents } from '../../enums/item-events';
import { ItemService } from '../../services/item.service';

@Component({
  selector: 'dialog-delete-item',
  templateUrl: './delete-item-dialog.component.html',
  styleUrls: ['./delete-item-dialog.component.css']
})
export class DeleteItemDialogComponent extends BaseNavigableDialogComponent {
  
  item: Item = null;

  get itemName() {
    return this.item == null ? "" : this.item.name;
  }

  constructor(private service: ItemService, protected eventBus: EventBusService) {
    super(eventBus);
    this.eventId = ItemDialogEvents.DeleteItem
  }
  
  protected override async onDisplay() {
    (await this.service.getItem(this.service.getSelectedItemId())).subscribe({
      next: (response) => {
        this.item = response;
      },
      error: (error) => {
        console.log('Error at get item found: ', error);
      }
    })
  } 

  protected override onHide() {
    this.service.deselect();
  }

  // response functions

  async delete() {
    await Interval(() => this.item == null, 10, 1000);
    (await this.service.deleteItem(this.item.id)).subscribe({
      next: (_response) => {
        this.eventBus.emit(new EventData(ItemEvents.DeleteItem, this.item.id));
        this.exitDialog();
      },
      error: (error) => {
        console.log('Error at delete item found: ', error);
      }
    });
  }
}