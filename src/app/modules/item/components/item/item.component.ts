import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Item } from 'src/app/models/response/item/item';
import { EventData } from 'src/app/models/utils/event';
import { EventSubscription } from 'src/app/models/utils/event-subscription';
import { ListItemDirective } from 'src/app/modules/shared/directives/list/list-item/list-item.directive';
import { EventBusService } from 'src/app/modules/shared/services/event-bus.service';
import { ItemDialogEvents } from '../../enums/item-dialog-events';
import { ItemEvents } from '../../enums/item-events';
import { ItemService } from '../../services/item.service';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent extends ListItemDirective implements OnInit, OnDestroy {

  @Input()
  hasControls = true;

  @Input()
  isShort = false;
  
  @Input()
  item = new Item();

  itemUpdateSubscription: EventSubscription;

  constructor(private service: ItemService, private eventBus: EventBusService) {
    super();
  }

  protected override onSetItemId() {
    this.initSubscriptionsFactory();
  }

  protected override loadData() {
    this.getItem();
  }

  ngOnInit(): void {
    this.getItem();
    this.itemUpdateSubscription.init();
  }

  ngOnDestroy(): void {
    this.itemUpdateSubscription.clear();
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

  // Subscriptions methods

  private initSubscriptionsFactory() {
    this.itemUpdateSubscription = new EventSubscription(this.eventBus, ItemEvents.UpdateItem+this.itemId, () => {
      this.getItem();
    })
  }

  // Utils

  private select(eventId: string) {
    this.service.select(this.item.id);
    this.eventBus.emit(new EventData(eventId, this.item.id));
  }

}
