import { Component } from '@angular/core';
import { EventBusService } from 'src/modules/shared/services/event-bus.service';
import { EventData } from '../../../shared/utils/event-data';
import { InventoryRoutes } from '../../enums/inventory-routes';
import { InventoryEvents } from '../../enums/inventory-events';
import { InventoryService } from '../../services/inventory.service';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory-page.component.html',
  styleUrls: ['./inventory-page.component.css']
})
export class InventoryPageComponent {

  addItemEventId = InventoryRoutes.Select;

  constructor(private eventBus: EventBusService, private service: InventoryService) {}

  search(searchBody) {
    this.eventBus.emit(new EventData(InventoryEvents.Refresh, searchBody.searchString));
  }

  getEventValue(event: Event) {
    let str = event as unknown as string;
    if(str != null)
      return str;
    return (event.target as HTMLInputElement).value;
  }

  onSelectItemClicked(state: boolean) {
    this.service.selectItemState = true;
  }
}
