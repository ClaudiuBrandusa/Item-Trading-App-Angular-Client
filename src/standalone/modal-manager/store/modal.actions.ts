import { createAction } from "@ngrx/store";

export enum ModalActionType {
  OpenPopupInit = "modal_open_popup_initiated",
  OpenPopupSucceeded = "modal_open_popup_succeeded",
  ClosePopupInit = "modal_close_popup_initiated",
  ClosePopupSucceeded = "modal_close_popup_succeeded"
}

export const openPopupInitiated = createAction(ModalActionType.OpenPopupInit, (popupName: string) => ({ popupName }));

export const openPopupSucceeded = createAction(ModalActionType.OpenPopupSucceeded);

export const closePopupInitiated = createAction(ModalActionType.ClosePopupInit, (popupName: string) => ({ popupName }));

export const closePopupSucceeded = createAction(ModalActionType.ClosePopupSucceeded);