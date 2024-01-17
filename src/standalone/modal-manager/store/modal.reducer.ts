import { Action, createReducer, on } from "@ngrx/store";
import { ModalState, initialState } from "./modal.state";
import { closePopupInitiated, openPopupSucceeded, openPopupInitiated, closePopupSucceeded } from "./modal.actions";
import { disconnected } from "../../../modules/identity/store/identity/identity.actions";

export function ModalReducer(
  state: ModalState = initialState,
  action: Action
) {
  return modalReducer(state, action)
}

const modalReducer = createReducer(
  initialState,
  on(openPopupInitiated, (state, { popupName }) => ({ ...state, modalToBeOpen: popupName })),
  on(openPopupSucceeded, (state) => ({ ...state, modalToBeOpen: initialState.modalToBeOpen })),
  on(closePopupInitiated, (state, { popupName }) => ({ ...state, modalToBeClosed: popupName })),
  on(closePopupSucceeded, (state) => ({ ...state, modalToBeClosed: initialState.modalToBeClosed })),
  on(disconnected, () => ({ ...initialState }))
);