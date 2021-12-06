import { Subscription } from "rxjs/internal/Subscription";
import { EventBusService } from "src/app/modules/shared/services/event-bus.service";

export class EventSubscription {
    private subscription: Subscription;

    constructor(private eventBus: EventBusService, private eventId: string, private callback: (any?) => any) { }

    init() {
        this.subscription = this.eventBus.initSubscription(this.subscription, this.eventId, this.callback);
    }

    clear() {
        this.subscription = this.eventBus.clearSubscription(this.subscription);
    }
}