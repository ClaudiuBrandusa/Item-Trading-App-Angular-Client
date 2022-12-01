import { Injectable } from '@angular/core';
import { PageEvents } from '../enums/page-events.enum';
import { EventBusService } from './event-bus.service';
import { EventBusUtils } from '../utils/event-bus.utility';

/**
 * This service handles the logic between the pages and the page navigation stack
 */
@Injectable({
  providedIn: 'root'
})
export class PageNavigationService {

  private eventBusUtility: EventBusUtils;
  private currentPageSelected: string;

  constructor(eventBus: EventBusService) {
    this.eventBusUtility = new EventBusUtils(eventBus);
    this.registerSubscriptions();
  }

  private registerSubscriptions() {
    this.eventBusUtility.on(PageEvents.Open, (data) => {
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
    this.eventBusUtility.emit(eventId, data);
  }
}
