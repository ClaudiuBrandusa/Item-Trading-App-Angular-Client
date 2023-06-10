import { Component } from '@angular/core';
import { EventBusService } from 'src/modules/shared/services/event-bus.service';
import { EventData } from '../../../shared/utils/event-data';
import { ItemEvents } from '../../enums/item-events';
import { ItemRoutes } from '../../enums/item-routes';
import { ItemService } from '../../services/item.service';

@Component({
  selector: 'app-items',
  templateUrl: './items-page.component.html',
  styleUrls: ['./items-page.component.css']
})
export class ItemsComponent {

  createEventId = ItemRoutes.Create

  constructor(private eventBus: EventBusService, private service: ItemService) { }

  search(searchBody) {
    this.eventBus.emit(new EventData(ItemEvents.RefreshItemsList, searchBody.searchString));
  }

  getEventValue(event: Event) {
    let str = event as unknown as string;
    if(str != null)
      return str;
    return (event.target as HTMLInputElement).value;
  }

  onSelectItemClicked(event) {
    this.service.isCreatingNewItem = true;
  }
}
