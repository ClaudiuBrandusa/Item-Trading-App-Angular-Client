import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { DialogEvents } from '../enums/dialog-events.enum';
import { DialogNavigationStackService } from './dialog-navigation-stack.service';
import { EventBusService } from './event-bus.service';
import { EventData } from 'src/app/models/utils/event';

/**
 * This service handles the logic between the dialogs and the dialog stack
 */
@Injectable({
  providedIn: 'root'
})
export class DialogNavigationService {

  onOpenDialogSubscription: Subscription;
  onBackDialogSubscription: Subscription;
  onCloseDialogSubscription: Subscription;

  constructor(private navigationStack: DialogNavigationStackService, private eventBus: EventBusService) {
    this.registerSubscriptions();
   }

  private registerSubscriptions() {
    this.onOpenDialogSubscription = this.eventBus.on(DialogEvents.Open, (data) => {
      const currentDialog = this.navigationStack.current();
      if (currentDialog) {
        this.eventBus.emit(new EventData(`${DialogEvents.Exit}/${currentDialog}`, null));
      }

      this.navigationStack.navigate(data);
      this.eventBus.emit(new EventData(`${DialogEvents.Open}/${data}`, null));
    });

    this.onBackDialogSubscription = this.eventBus.on(DialogEvents.Back, (data) => {
      const currentDialog = this.navigationStack.current();

      if (currentDialog !== data) {
        return;
      }
      
      this.eventBus.emit(new EventData(`${DialogEvents.Exit}/${currentDialog}`, null));
      this.navigationStack.back();
      const previousDialog = this.navigationStack.current();

      if(previousDialog)
        this.eventBus.emit(new EventData(`${DialogEvents.Open}/${previousDialog}`, null));
    })

    this.onCloseDialogSubscription = this.eventBus.on(DialogEvents.Exit, (data) => {
      this.eventBus.emit(new EventData(`${DialogEvents.Exit}/${data}`, null));
      
      this.navigationStack.clear();
    })
  }
}
