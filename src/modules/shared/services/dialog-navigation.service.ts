import { Injectable } from '@angular/core';
import { DialogEvents } from '../enums/dialog-events.enum';
import { DialogNavigationStackService } from './dialog-navigation-stack.service';
import { EventBusService } from './event-bus.service';
import { EventBusUtils } from '../utils/event-bus.utility';
import { EventData } from '../utils/event-data';

/**
 * This service handles the logic between the dialogs and the dialog stack
 */
@Injectable({
  providedIn: 'root'
})
export class DialogNavigationService {

  private eventBusUtility: EventBusUtils;

  constructor(private navigationStack: DialogNavigationStackService, private eventBus: EventBusService) {
    this.eventBusUtility = new EventBusUtils(eventBus);
    this.registerSubscriptions();
   }

  private registerSubscriptions() {
    this.eventBusUtility.on(DialogEvents.Open, (data) => {
      const currentDialog = this.navigationStack.current();
      if (currentDialog) {
        this.eventBus.emit(new EventData(`${DialogEvents.Exit}/${currentDialog}`, null));
      }

      this.navigate(data);
    });

    this.eventBusUtility.on(DialogEvents.OpenAsPopup, (data) => {
      this.navigate(data);
    });

    this.eventBusUtility.on(DialogEvents.ClosePopup, (data) => {
      this.exit(data);
    })

    this.eventBusUtility.on(DialogEvents.Back, (data) => {
      this.handleOnBackSubscription(data);
    })

    this.eventBusUtility.on(DialogEvents.Exit, (data) => {
      if(this.navigationStack.isRoot()) {
        this.eventBus.emit(new EventData(`${DialogEvents.Exit}/${data}`, null));
        this.navigationStack.clear();
      }

      this.handleOnBackSubscription(data);
    })

    this.eventBusUtility.on(DialogEvents.ClearStack, () => {
      let currentDialogName = this.navigationStack.back();
      while(currentDialogName) {
        this.eventBus.emit(new EventData(`${DialogEvents.Exit}/${currentDialogName}`, null));
        currentDialogName = this.navigationStack.back();
      }
    })
  }

  private navigate(data: string) {
    this.navigationStack.navigate(data);
    this.eventBus.emit(new EventData(`${DialogEvents.Open}/${data}`, null));
  }

  private handleOnBackSubscription(data: any) {
    this.exit(data);
    const previousDialog = this.navigationStack.current();

    if(previousDialog)
      this.eventBus.emit(new EventData(`${DialogEvents.Open}/${previousDialog}`, null));
  }

  private exit(data) {
    const currentDialog = this.navigationStack.current();

    if (currentDialog !== data) {
      return;
    }

    this.eventBus.emit(new EventData(`${DialogEvents.Exit}/${currentDialog}`, null));
    this.navigationStack.back();
  }
}
