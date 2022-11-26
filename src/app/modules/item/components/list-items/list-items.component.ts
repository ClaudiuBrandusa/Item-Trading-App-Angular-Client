import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { EventSubscription } from 'src/app/models/utils/event-subscription';
import { ListDirective } from 'src/app/modules/shared/directives/list/list.directive';
import { EventBusService } from 'src/app/modules/shared/services/event-bus.service';
import { ItemEvents } from '../../enums/item-events';
import { ItemService } from '../../services/item.service';

@Component({
  selector: 'app-list-items',
  templateUrl: './list-items.component.html',
  styleUrls: ['./list-items.component.css']
})
export class ListItemsComponent extends ListDirective implements OnInit, OnDestroy {

  private listItemsSubscription: Subscription;

  refreshItemsListSubscription: EventSubscription;
  createItemSubscription: EventSubscription;

  constructor(private service: ItemService, private eventBus: EventBusService) {
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
    this.listItemsSubscription = (await this.service.listItems(searchString)).subscribe({
      next: (response) => {
        if(response == null)
          return;

        this.clear();
        const list = Array.from(response.itemsId) as Array<string>;
        list.forEach(elementId => {
          this.add(elementId);
        });
      },
      error: (error) => {
        console.log('Error found at list item: ', error);
      }
    });
  }

  addItem(itemId: string) {
    this.add(itemId);
  }

  private initSubscriptionsFactory() {
    this.refreshItemsListSubscription = new EventSubscription(this.eventBus, ItemEvents.RefreshItemsList, (searchString) => { 
      this.listItems(searchString);
    });
    
    this.createItemSubscription = new EventSubscription(this.eventBus, ItemEvents.CreateItem, (value) => {
      this.addItem(value);
    });
  }

  private initSubscriptions() {
    this.refreshItemsListSubscription.init();
    this.createItemSubscription.init();
  }

  private clearSubscriptions() {
    this.refreshItemsListSubscription.clear();
    this.createItemSubscription.clear();
    this.listItemsSubscription?.unsubscribe();
  }

}
