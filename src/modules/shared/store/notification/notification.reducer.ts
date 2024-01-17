import { Action, createReducer, on } from "@ngrx/store";
import { NotificationState, adapter, initialState } from "./notification.state";
import { addNotification, closeNotificationsMenu, openNotificationsMenu, removeNotification } from "./notification.actions";
import { disconnected } from "../../../identity/store/identity/identity.actions";

export function NotificationReducer(
  state: NotificationState = initialState,
  action: Action
) {
  return notificationReducer(state, action);
};

const notificationReducer = createReducer(
  initialState,
  on(addNotification, (state, notification) => adapter.addOne(notification, state)),
  on(removeNotification, (state, { notificationId }) => adapter.removeOne(notificationId, state)),
  on(openNotificationsMenu, (state) => ({ ...state, menuOpened: true })),
  on(closeNotificationsMenu, (state) => ({ ...state, menuOpened: initialState.menuOpened })),
  on(disconnected, () => adapter.removeAll({ ...initialState }))
);