import { createFeatureSelector, createSelector } from "@ngrx/store";
import { NotificationState } from "./notification.state";
import { MessageNotification } from "../models/message-notification";

export const selectNotificationFeature = createFeatureSelector<NotificationState>("notification");

export const selectNotifications =
  createSelector(
    selectNotificationFeature,
    (state) => {
      const array = new Array<MessageNotification>();
      state.ids.forEach(id => array.splice(0, 0, state.entities[id]));
      return array;
    }
  );

export const selectNotificationsCount =
  createSelector(
    selectNotificationFeature,
    (state) => {
      return state.ids.length;
    }
  );

const selectNotificationsMenuOppened =
  createSelector(
    selectNotificationFeature,
    (state) => {
      return state.menuOpened;
    }
  )

export const selectNotificationsMenuVisibility =
  createSelector(
    selectNotificationsMenuOppened,
    (menuOpened) => {
      return menuOpened;
    }
  );