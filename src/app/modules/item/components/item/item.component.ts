import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Item } from 'src/app/models/response/item/item';
import { EventData } from 'src/app/models/utils/event';
import { EventBusService } from 'src/app/modules/shared/services/event-bus.service';
import { ItemDialogEvents } from '../../enums/item-dialog-events';
import { ItemEvents } from '../../enums/item-events';
import { ItemService } from '../../services/item.service';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit, OnDestroy {

  @Input()
  itemId = "";

  @Input()
  item = new Item();

  itemUpdateSubscription: Subscription;

  constructor(private service: ItemService, private eventBus: EventBusService) { }

  ngOnInit(): void {
    this.getItem();
    if(!this.itemUpdateSubscription) {
      this.itemUpdateSubscription = this.eventBus.on(ItemEvents.UpdateItem+this.itemId, () => {
        this.getItem();
      });
    }
  }

  ngOnDestroy(): void {
    if(this.itemUpdateSubscription != null)
    {
      this.itemUpdateSubscription.unsubscribe();
      this.itemUpdateSubscription = null;
    }
  }

  async getItem() {
    this.item = await this.service.getItem(this.itemId);
  }

  edit() {
    this.select(ItemDialogEvents.EditItem);
  }

  delete() {
    this.select(ItemDialogEvents.DeleteItem);
  }

  details() {
    this.select(ItemDialogEvents.DetailsItem);
  }

  private select(eventId: string) {
    this.service.select(this.item.id);
    this.eventBus.emit(new EventData(eventId, this.item.id));
  }

}
