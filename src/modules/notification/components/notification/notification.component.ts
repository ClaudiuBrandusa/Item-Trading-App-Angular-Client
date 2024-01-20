import { Component, Input, OnDestroy } from '@angular/core';
import { MessageNotification } from '../../models/message-notification';
import { Store } from '@ngrx/store';
import { removeNotification } from '../../store/notification.actions';
import { TimeSpan } from '../../../shared/utils/time-span';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css', '../../../../css/effects.css']
})
export class NotificationComponent implements OnDestroy {
  private notificationData: MessageNotification;

  @Input()
  public set data(newValue: MessageNotification) {
    this.notificationData = newValue;
    this.truncated = newValue.description.length > 99;
    this.dateTime = new Date(this.notificationData.dateTime);
    this.isError = this.notificationData.isError;
    this.updateElapsedTime();
  }

  private subscription: Subscription;

  @Input()
  public set elapsedTimeSubscription(observable: Observable<number>) {
    this.subscription = observable.subscribe(() => {
      this.updateElapsedTime();
    });
  }

  private dateTime;

  public get data(): MessageNotification {
    return this.notificationData;
  }

  public createdTime = "";

  clicked = false;
  truncated = false;
  expand = false;
  isError = false;

  constructor(private store: Store) {}
  
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  expandNotification() {
    if (!this.truncated) return;

    this.expand = !this.expand;
  }

  dismissNotification() {
    if (this.clicked) return;

    this.clicked = true;
    setTimeout(() => {
      this.store.dispatch(removeNotification(this.notificationData.id));
    }, 500);
  }

  private updateElapsedTime() {
    const timeSpan = new TimeSpan(new Date().valueOf() - this.dateTime.valueOf());
    
    this.createdTime = timeSpan.total_time_as_string;
  }
}
