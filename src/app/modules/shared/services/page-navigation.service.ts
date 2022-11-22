import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { PageEvents } from '../enums/page-events.enum';
import { EventBusService } from './event-bus.service';
import { EventData } from 'src/app/models/utils/event';

/**
 * This service handles the logic between the pages and the page navigation stack
 */
@Injectable({
  providedIn: 'root'
})
export class PageNavigationService {

  onOpenPageSubscription: Subscription;

  private currentPageSelected: string;

  constructor(private eventBus: EventBusService) {
    this.registerSubscriptions();
  }

  private registerSubscriptions() {
    this.onOpenPageSubscription = this.eventBus.on(PageEvents.Open, (data) => {
      // deselect the button of the previous page
      if (this.currentPageSelected === '' || this.currentPageSelected)
        this.emit(`${PageEvents.Exit}/${this.currentPageSelected}`);
      this.currentPageSelected = data;
      // open the selected page
      this.emit(`${PageEvents.Open}/${data}`);
      // select the clicked button
    })
  }

  private emit(eventId: string, data: any = null) {
    this.eventBus.emit(new EventData(eventId, data))
  }
}
