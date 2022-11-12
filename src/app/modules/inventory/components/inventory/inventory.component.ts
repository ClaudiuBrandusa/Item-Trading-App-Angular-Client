import { Component } from '@angular/core';
import { EventData } from 'src/app/models/utils/event';
import { EventBusService } from 'src/app/modules/shared/services/event-bus.service';
import { InventoryEvents } from '../../enums/InventoryEvents';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent {

  constructor(private eventBus: EventBusService) { }

  search(searchString: string) {
    this.eventBus.emit(new EventData(InventoryEvents.Refresh, searchString));
  }

  getEventValue(event: Event) {
    let str = event as unknown as string;
    if(str != null)
      return str;
    return (event.target as HTMLInputElement).value;
  }

}
