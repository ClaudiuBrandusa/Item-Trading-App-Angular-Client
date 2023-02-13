import { Injectable } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { EventData } from '../utils/event-data';

@Injectable({
  providedIn: 'root'
})
export class EventBusService {
  private subject$ = new Subject<EventData>();

  constructor() { }

  // used in order to fire an event
  emit(event: EventData) {
    this.subject$.next(event);
  }

  // gets called when the event is fired
  // in the second parameter we give a lambda in which we specify what we want to do when the event fires 
  on(eventName: string, action: any): Subscription {
    return this.subject$.pipe(
      filter((e: EventData) => e.name === eventName),
      map((e: EventData) => e["value"])).subscribe(action);
  }

  // utils
  initSubscription(subscription: Subscription, eventId: string, callback: (any?) => any) : Subscription {
    if(subscription != null) {
        // then it means that the subscription had already been set
        return subscription;
    }

    return this.on(eventId, callback);
  }

  clearSubscription(subscription: Subscription) {
    if(subscription != null) {
        subscription.unsubscribe();
        subscription = null;
    }

    return subscription;
  }
}
