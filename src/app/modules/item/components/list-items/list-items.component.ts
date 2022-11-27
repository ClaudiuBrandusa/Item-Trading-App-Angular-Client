import { Component, OnDestroy, OnInit } from '@angular/core';
import { ListDirective } from 'src/app/modules/shared/directives/list/list.directive';
import { EventBusService } from 'src/app/modules/shared/services/event-bus.service';
import { EventBusUtils } from '../../../shared/utils/event-bus.utility';
import { ItemEvents } from '../../enums/item-events';
import { ItemService } from '../../services/item.service';

@Component({
  selector: 'app-list-items',
  templateUrl: './list-items.component.html',
  styleUrls: ['./list-items.component.css']
})
export class ListItemsComponent extends ListDirective implements OnInit, OnDestroy {

  private eventBusUtility: EventBusUtils;

  constructor(private service: ItemService, eventBus: EventBusService) {
    super();
    this.eventBusUtility = new EventBusUtils(eventBus);
  }

  async ngOnInit(): Promise<void> {
    this.initSubscriptions();
    this.listItems();
  }

  ngOnDestroy(): void {
    this.eventBusUtility.clearSubscriptions();
  }

  async listItems(searchString: string = "") {
    (await this.service.listItems(searchString)).subscribe({
      next: (response) => {
        if(response == null)
          return;
        
        this.addList(response.itemsId);
      },
      error: (error) => {
        console.log('Error found at list item: ', error);
      }
    });
  }

  private initSubscriptions() {
    this.eventBusUtility.on(ItemEvents.RefreshItemsList, (searchString) => { 
      this.listItems(searchString);
    });
    
    this.eventBusUtility.on(ItemEvents.CreateItem, (value) => {
      this.add(value);
    });
  }

}
