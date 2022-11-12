import { Component, OnDestroy, OnInit } from '@angular/core';
import { EventSubscription } from 'src/app/models/utils/event-subscription';
import { ListDirective } from 'src/app/modules/shared/directives/list/list.directive';
import { EventBusService } from 'src/app/modules/shared/services/event-bus.service';
import { InventoryEvents } from '../../enums/InventoryEvents';
import { InventoryService } from '../../services/inventory.service';
import { EventData } from 'src/app/models/utils/event';

@Component({
  selector: 'app-list-inventory',
  templateUrl: './list-inventory.component.html',
  styleUrls: ['./list-inventory.component.css']
})
export class ListInventoryComponent extends ListDirective implements OnInit, OnDestroy {

  refreshItemsListSubscription: EventSubscription;
  createItemSubscription: EventSubscription;
  removeItemSubscription: EventSubscription;
  
  constructor(private service: InventoryService, private eventBus: EventBusService) {
    super();
    this.initSubscriptionsFactory();
  }

  async ngOnInit(): Promise<void> {
    this.initSubscriptions();
    this.listItems();
  }

  ngOnDestroy(): void {
    this.clearSubscriptions();
  }

  async listItems(searchString: string = "") {
    const list = await this.service.list(searchString); /* list of items id */
    this.addList(list);
  }

  protected override onAddElement(itemId: string) {
    this.eventBus.emit(new EventData(InventoryEvents.RefreshItem+itemId, null));
  }


  // Subscriptions
  
  private initSubscriptionsFactory() {
    this.refreshItemsListSubscription = new EventSubscription(this.eventBus, InventoryEvents.Refresh, (searchString) => {
      this.listItems(searchString);
    });
    
    this.createItemSubscription = new EventSubscription(this.eventBus, InventoryEvents.Add, (value) => {
      this.add(value);
    });

    this.removeItemSubscription = new EventSubscription(this.eventBus, InventoryEvents.Remove, (value) => {
      this.remove(value);
    });
  }

  private initSubscriptions() {
    this.refreshItemsListSubscription.init();
    this.createItemSubscription.init();
    this.removeItemSubscription.init();
  }

  private clearSubscriptions() {
    this.refreshItemsListSubscription.clear();
    this.createItemSubscription.clear();
    this.removeItemSubscription.clear();
  }
}
