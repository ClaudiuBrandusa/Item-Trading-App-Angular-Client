import { Subscription } from "rxjs";
import { EventBusService } from "../services/event-bus.service";
import { EventData } from 'src/app/models/utils/event';

export class EventBusUtils {
  private subscriptions: object;

  constructor(private eventBus: EventBusService) {
    this.subscriptions = {};
  }

  on(eventId: string, response: (id?) => any, unique: Boolean = true)
  {
    const subscription = this.eventBus.on(eventId, response);

    if (this.hasKey(eventId)) {
      if (unique) return;
      this.subscriptions[eventId].add(subscription);
    } else {
      this.subscriptions[eventId] = new Array(subscription);
    }
  }

  emit(eventId: string, value: any) {
    this.eventBus.emit(new EventData(eventId, value));
  }

  unsubscribe(eventId: string) {
    if (!this.hasKey(eventId)) return;

    (this.subscriptions[eventId] as Array<Subscription>).forEach(subscription => {
      this.eventBus.clearSubscription(subscription);
    });

    delete this.subscriptions[eventId];
  }

  clearSubscriptions() {
    const keys = Object.keys(this.subscriptions);

    keys.forEach(key => this.unsubscribe(key));
  }

  private hasKey(key: string) {
    const keys = Object.keys(this.subscriptions);

    return keys.includes(key);
  }
}