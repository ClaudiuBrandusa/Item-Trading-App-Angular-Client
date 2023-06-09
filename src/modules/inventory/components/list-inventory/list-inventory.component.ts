import { Component, OnDestroy, OnInit } from '@angular/core';
import { ListDirective } from 'src/modules/shared/directives/list/list.directive';
import { EventBusService } from 'src/modules/shared/services/event-bus.service';
import { InventoryEvents } from '../../enums/inventory-events';
import { InventoryService } from '../../services/inventory.service';
import { ItemError } from '../../../shared/models/errors/item-error';
import { EventBusUtils } from '../../../shared/utils/event-bus.utility';
import { EventData } from '../../../shared/utils/event-data';

@Component({
  selector: 'app-list-inventory',
  templateUrl: './list-inventory.component.html',
  styleUrls: ['./list-inventory.component.css']
})
export class ListInventoryComponent extends ListDirective implements OnInit, OnDestroy {
  
  private eventBusUtility: EventBusUtils;
  
  constructor(private service: InventoryService, private eventBus: EventBusService) {
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
    this.service.list(searchString).subscribe({
      next: (response: any) => {
        this.addList(response.itemsId);
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

  private initSubscriptions() {
    this.eventBusUtility.on(InventoryEvents.Refresh, (searchString) => {
      this.listItems(searchString);
    });
    
    this.eventBusUtility.on(InventoryEvents.Add, (value) => {
      this.add(value);
    });

    this.eventBusUtility.on(InventoryEvents.Remove, (value) => {
      this.remove(value);
    });
  }
}
