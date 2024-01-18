import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationComponent } from './components/notification/notification.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { PipeModule } from '../pipe/pipe.module';
import { NotificationReducer } from './store/notification.reducer';
import { StoreModule } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import * as notificationEffects from './store/notification.effects';



@NgModule({
  declarations: [
    NotificationComponent,
    NotificationsComponent
  ],
  imports: [
    CommonModule,
    PipeModule,
    StoreModule.forFeature("notification", NotificationReducer)
  ],
  exports: [
    NotificationComponent,
    NotificationsComponent
  ],
  providers: [
    provideEffects(notificationEffects)
  ]
})
export class NotificationModule { }
