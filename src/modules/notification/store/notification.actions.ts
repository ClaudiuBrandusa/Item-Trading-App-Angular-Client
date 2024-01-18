import { createAction } from "@ngrx/store";
import { MessageNotification } from "../models/message-notification";
import { SignalRNotification } from "../../shared/models/signal-r/signal-r-notification";
import { DefaultException } from "../../shared/models/errors/default-exception";
import { ModifiedNotification } from "../models/modified-notification";

export enum NotificationActionType {
  HandleReceivedNotification = "handle_received_notification",
  HandleDefaultException = "handle_default_exception",
  AddNotification = "add_notification",
  RemoveNotification = "remove_notification",
  OpenNotificationsMenu = "open_notifications_menu",
  CloseNotificationsMenu = "close_notifications_menu",
  CreatedNotification = "created_notification",
  ChangedNotification = "changed_notification",
  DeletedNotification = "deleted_notification"
}

export const handleReceivedNotification = createAction(NotificationActionType.HandleReceivedNotification, (notification: SignalRNotification) => ({ notification }));

export const handleDefaultException = createAction(NotificationActionType.HandleDefaultException, (errorMessage: string, errorBody: any) => (new DefaultException({ message: errorMessage, body: errorBody })));

export const addNotification = createAction(NotificationActionType.AddNotification, (notification: MessageNotification) => ({ ...notification, id: MessageNotification.currentId++ }));

export const removeNotification = createAction(NotificationActionType.RemoveNotification, (notificationId: number) => ({ notificationId }));

export const openNotificationsMenu = createAction(NotificationActionType.OpenNotificationsMenu);

export const closeNotificationsMenu = createAction(NotificationActionType.CloseNotificationsMenu);

export const createdNotification = createAction(NotificationActionType.CreatedNotification, (notification: ModifiedNotification) => ({ notification }));

export const changedNotification = createAction(NotificationActionType.ChangedNotification, (notification: ModifiedNotification) => ({ notification }));

export const deletedNotification = createAction(NotificationActionType.DeletedNotification, (notification: ModifiedNotification) => ({ notification }));