import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { InventoryItem } from 'src/app/models/response/inventory/inventory-item';
import { EventData } from 'src/app/models/utils/event';
import { EventSubscription } from 'src/app/models/utils/event-subscription';
import { ListItemDirective } from 'src/app/modules/shared/directives/list/list-item/list-item.directive';
import { EventBusService } from 'src/app/modules/shared/services/event-bus.service';
import { InventoryDialogEvents } from '../../enums/InventoryDialogEvents';
import { InventoryEvents } from '../../enums/InventoryEvents';
import { InventoryService } from '../../services/inventory.service';

@Component({
  selector: 'app-inventory-item',
  templateUrl: './inventory-item.component.html',
  styleUrls: ['./inventory-item.component.css']
})
export class InventoryItemComponent extends ListItemDirective implements OnInit, OnDestroy {
 
  @Input()
  item = new InventoryItem();

  itemAddSubscription: EventSubscription;
  itemDropSubscription: EventSubscription;
  
  constructor(private service: InventoryService, private eventBus: EventBusService) {
    super();
  }

  ngOnInit(): void {
    this.getItem();
    this.itemAddSubscription.init();
    this.itemDropSubscription.init();
  }

  ngOnDestroy(): void {
    this.itemAddSubscription.clear();
    this.itemDropSubscription.clear();
  }

  protected override onSetItemId() {
    this.initSubscriptionsFactory();
  }

  protected override loadData() {
    this.getItem();
  }

  async getItem() {
    this.item = await this.service.getItem(this.itemId);
  }

  add() {
    this.select(InventoryDialogEvents.Add);
  }

  drop() {
    this.select(InventoryDialogEvents.Drop);
  }

  details() {
    this.select(InventoryDialogEvents.Details);
  }

  // Subscriptions methods

  private initSubscriptionsFactory() {
    this.itemAddSubscription = new EventSubscription(this.eventBus, InventoryEvents.Add+this.itemId, () => {
      this.getItem();
    });

    this.itemDropSubscription = new EventSubscription(this.eventBus, InventoryEvents.Drop+this.itemId, () => {
      this.getItem();
    });
  }

  // Utils

  private select(eventId: string) {
    this.service.select(this.item.id);
    this.eventBus.emit(new EventData(eventId, this.item.id));
  }

}
