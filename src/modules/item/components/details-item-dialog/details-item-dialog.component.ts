import { Component } from '@angular/core';
import { Item } from 'src/modules/item/models/responses/item';
import { EventBusService } from 'src/modules/shared/services/event-bus.service';
import { BaseNavigableDialogComponent } from '../../../shared/components/dialog/base-navigable-dialog/base-navigable-dialog.component';
import { ItemDialogEvents } from '../../enums/item-dialog-events';
import { ItemService } from '../../services/item.service';

@Component({
  selector: 'dialog-details-item',
  templateUrl: './details-item-dialog.component.html',
  styleUrls: ['./details-item-dialog.component.css']
})
export class DetailsItemDialogComponent extends BaseNavigableDialogComponent {

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
