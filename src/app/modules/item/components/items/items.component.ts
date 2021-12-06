import { Component } from '@angular/core';
import { EventData } from 'src/app/models/utils/event';
import { EventBusService } from 'src/app/modules/shared/services/event-bus.service';
import { ItemEvents } from '../../enums/item-events';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent {

  constructor(private eventBus: EventBusService) { }

  search(searchString: string) {
    this.eventBus.emit(new EventData(ItemEvents.RefreshItemsList, searchString));
  }

  getEventValue(event: Event) {
    let str = event as unknown as string;
    if(str != null)
      return str;
    return (event.target as HTMLInputElement).value;
  }

}
