import { Component } from '@angular/core';
import { Item } from 'src/app/models/response/item/item';
import { BaseDialogComponent } from 'src/app/modules/shared/components/dialog/base-dialog/base-dialog.component';
import { EventBusService } from 'src/app/modules/shared/services/event-bus.service';
import { ItemDialogEvents } from '../../enums/item-dialog-events';
import { ItemService } from '../../services/item.service';

@Component({
  selector: 'dialog-details-item',
  templateUrl: './details-item-dialog.component.html',
  styleUrls: ['./details-item-dialog.component.css']
})
export class DetailsItemDialogComponent extends BaseDialogComponent {

  item: Item = null;

  get itemName() {
    return this.item == null ? "" : this.item.name;
  }

  get itemDescription() {
    return this.item == null ? "" : this.item.description;
  }

  constructor(protected eventBus: EventBusService, private service: ItemService) {
    super(eventBus);
    this.eventId = ItemDialogEvents.DetailsItem;
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

  exit() {
    this.exitDialog();
  }
}
