import { Component, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { isString } from 'src/app/models/utils/async-utils';
import { EventBusService } from 'src/app/modules/shared/services/event-bus.service';
import { ItemEvents } from '../../enums/events';
import { ItemService } from '../../services/item.service';

@Component({
  selector: 'app-list-items',
  templateUrl: './list-items.component.html',
  styleUrls: ['./list-items.component.css']
})
export class ListItemsComponent implements OnInit, OnDestroy {

  @Output()
  itemsIdList = new Array<string>();

  refreshItemsListSubscription: Subscription;
  createItemSubscription: Subscription;

  constructor(private service: ItemService, private eventBus: EventBusService) { }

  async ngOnInit(): Promise<void> {
    this.initSubscription();
    this.listItems();
  }

  ngOnDestroy(): void {
    this.clearSubscription();
  }

  async listItems(searchString: string = "") {
    let list = await this.service.listItems(); /* list of items id */
  
    if(list == null)
      return;

    this.clearList();

    list.forEach(async element => {
      this.itemsIdList.push(element);
    });
  }

  clearList() {
    while(this.itemsIdList.length > 0) {
      this.itemsIdList.pop();
    }
  }

  getEventValue(event: Event) {
    let str = event as unknown as string;
    if(str != null)
      return str;
    return (event.target as HTMLInputElement).value;
  }

  private initSubscription() {
    this.refreshItemsListSubscription = this.eventBus.on(ItemEvents.RefreshItemsList, (searchString) => {
      if(isString(searchString)) {
        this.listItems(searchString);
      }
    });
    
    this.createItemSubscription = this.eventBus.on(ItemEvents.CreateItem, (value) => {
      if(isString(value)) {
        if(!this.itemsIdList.includes(value))
          this.itemsIdList.push(value);
      }
    });
  }

  private clearSubscription() {
    if(this.refreshItemsListSubscription != null) {
      this.refreshItemsListSubscription.unsubscribe();
      this.refreshItemsListSubscription = null;
    }
    
    if(this.createItemSubscription != null) {
      this.createItemSubscription.unsubscribe();
      this.createItemSubscription = null;
    }
  }

}
