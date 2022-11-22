import { Component, OnDestroy, OnInit } from '@angular/core';
import { EventSubscription } from 'src/app/models/utils/event-subscription';
import { ListDirective } from 'src/app/modules/shared/directives/list/list.directive';
import { EventBusService } from 'src/app/modules/shared/services/event-bus.service';
import { InventoryEvents } from '../../enums/InventoryEvents';
import { InventoryService } from '../../services/inventory.service';
import { EventData } from 'src/app/models/utils/event';
import { ItemError } from '../../../../models/errors/item-error';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-list-inventory',
  templateUrl: './list-inventory.component.html',
  styleUrls: ['./list-inventory.component.css']
})
export class ListInventoryComponent extends ListDirective implements OnInit, OnDestroy {

  refreshItemsListSubscription: EventSubscription;
  createItemSubscription: EventSubscription;
  removeItemSubscription: EventSubscription;

  private listSubscription: Subscription;
  
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
    this.listSubscription = await (await this.service.list(searchString)).subscribe({
      next: (response: any) => {
        const list = response.itemsId // a list of the items' id from the user's inventory
        this.addList(list);
      },
      error: (error: ItemError) => {
        console.log('Error found: ', error.message);
      }
    }); /* list of items id */
    
    
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

    this.listSubscription?.unsubscribe();
  }
}
