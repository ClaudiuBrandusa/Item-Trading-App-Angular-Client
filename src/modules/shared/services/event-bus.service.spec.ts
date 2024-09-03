import { take } from "rxjs";
import { TestBed } from '@angular/core/testing';
import { EventData } from "../utils/event-data";
import { EventBusService } from "./event-bus.service";

describe('EventBusService', () => {
  function getEventDataMock(): EventData {
    return new EventData("eventName", "eventValue");
  }
  
  let service: EventBusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventBusService);
  });

  it('#emit should fire an event', (done) => {
    let event = getEventDataMock();

    service.getObservable()
      .pipe(take(1))
      .subscribe((value) => {
        expect(value).toBe(event);
        done();
      });

    service.emit(event);
  });

  it('#on should execute when the event is fired', (done) => {
    let event = getEventDataMock();

    service.on(event.name, (value) => {
      expect(value).toBe(event.value);
      done();
    });

    service.emit(event)

    //done();
  });

  it('#clearSubscription should clear the given subscription', (done) => {
    let event = getEventDataMock();

    let subscription = service.on(event.name, () => {});

    service.clearSubscription(subscription);

    expect(subscription.closed).toBe(true);

    done();
  });
});
