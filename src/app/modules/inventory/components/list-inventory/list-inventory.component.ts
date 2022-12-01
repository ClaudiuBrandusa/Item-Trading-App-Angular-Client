import { Component, OnDestroy, OnInit } from '@angular/core';
import { ListDirective } from 'src/app/modules/shared/directives/list/list.directive';
import { EventBusService } from 'src/app/modules/shared/services/event-bus.service';
import { InventoryEvents } from '../../enums/InventoryEvents';
import { InventoryService } from '../../services/inventory.service';
import { EventData } from 'src/app/models/utils/event';
import { ItemError } from '../../../../models/errors/item-error';
import { EventBusUtils } from '../../../shared/utils/event-bus.utility';

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

  async ngOnInit(): Promise<void> {
    this.initSubscriptions();
    this.listItems();
  }

  ngOnDestroy(): void {
    this.eventBusUtility.clearSubscriptions();
  }

  async listItems(searchString: string = "") {
    (await this.service.list(searchString)).subscribe({
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
