import { Component } from '@angular/core';
import { Observable, interval, map } from 'rxjs';
import { MessageNotification } from '../../models/message-notification';
import { Store } from '@ngrx/store';
import { selectNotifications } from '../../store/notification.selector';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent {
  notifications$: Observable<MessageNotification[]>;
  elapsedTimeObservable = new Observable<number>();

  constructor(store: Store) {
    this.notifications$ = store.select(selectNotifications)
      .pipe(
        map((notifications) =>
          notifications
        )
      );
    this.elapsedTimeObservable = interval(1000 * 15 /* 15 seconds */);
  }
}
