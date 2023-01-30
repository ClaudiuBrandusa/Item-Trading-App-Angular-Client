import { Component, OnDestroy, OnInit } from '@angular/core';
import { ListDirective } from 'src/modules/shared/directives/list/list.directive';
import { EventBusService } from 'src/modules/shared/services/event-bus.service';
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

  ngOnInit(): void {
    this.initSubscriptions();
    this.listItems();
  }

  ngOnDestroy(): void {
    this.eventBusUtility.clearSubscriptions();
  }

  listItems(searchString: string = "") {
    this.service.listItems(searchString).subscribe({
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

    this.eventBusUtility.on(ItemEvents.DeleteItem, (value) => {
      this.remove(value);
    });
  }

}
