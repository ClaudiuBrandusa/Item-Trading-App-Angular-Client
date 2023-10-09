import { inject } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { addNotification, changedNotification, createdNotification, deletedNotification, handleDefaultException, handleReceivedNotification } from "./notification.actions";
import { exhaustMap, of } from "rxjs";
import { createErrorNotification, createMessageNotification } from "../../utils/notification-utils";
import { NotificationTypes } from "../../enums/notification-types.enum";
import { DefaultException } from "../../models/errors/default-exception";
import { ModifiedNotification } from "../../models/notifications/modified-notification";

export const receivedNotification = createEffect(
  (actions$ = inject(Actions)) => {
    return actions$.pipe(
      ofType(handleReceivedNotification),
      exhaustMap(({ notification }) => {
        if (notification.type == NotificationTypes.Information) {
          const data = notification.content as any;
          return of(addNotification(createMessageNotification(data.content, data.createdDateTime)));
        } else if (notification.type == NotificationTypes.Created) {
          return of(createdNotification(notification.content as ModifiedNotification));
        } else if (notification.type == NotificationTypes.Changed) {
          return of(changedNotification(notification.content as ModifiedNotification));
        } else if (notification.type == NotificationTypes.Deleted) {
          return of(deletedNotification(notification.content as ModifiedNotification));
        } else {
          return of(handleDefaultException(`Unknown notification type with value: ${notification.type}`, notification));
        }
      })
    );
  },
  { functional: true }
);

export const defaultNotificationError = createEffect(
  (actions$ = inject(Actions)) => {
    return actions$.pipe(
      ofType(handleDefaultException),
      exhaustMap((error: DefaultException) =>
        of(addNotification(createErrorNotification(error.message)))
      )
    );
  },
  { functional: true }
);