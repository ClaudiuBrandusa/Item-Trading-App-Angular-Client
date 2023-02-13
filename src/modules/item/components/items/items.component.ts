import { Component } from '@angular/core';
import { EventBusService } from 'src/modules/shared/services/event-bus.service';
import { EventData } from '../../../shared/utils/event-data';
import { ItemEvents } from '../../enums/item-events';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent {

  constructor(private eventBus: EventBusService) { }

  search(searchBody) {
    this.eventBus.emit(new EventData(ItemEvents.RefreshItemsList, searchBody.searchString));
  }

  getEventValue(event: Event) {
    let str = event as unknown as string;
    if(str != null)
      return str;
    return (event.target as HTMLInputElement).value;
  }

}
