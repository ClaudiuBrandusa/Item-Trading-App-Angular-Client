import { EntityAdapter, EntityState, createEntityAdapter } from "@ngrx/entity";
import { MessageNotification } from "../../models/notifications/message-notification";

export interface NotificationState extends EntityState<MessageNotification> {
  menuOpened: boolean;
}

export const adapter: EntityAdapter<MessageNotification> = createEntityAdapter<MessageNotification>({
  selectId: (notification: MessageNotification) => notification.id
});

export const initialState: NotificationState = adapter.getInitialState({
  menuOpened: false
});