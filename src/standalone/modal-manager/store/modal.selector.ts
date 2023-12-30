import { createFeatureSelector, createSelector } from "@ngrx/store";
import { ModalState } from "./modal.state";

export const selectModals = createFeatureSelector<ModalState>("modal");

export const selectModalComponentToBeOpen = createSelector(
  selectModals,
  (state: ModalState) => state.modalToBeOpen
);

export const selectModalComponentToBeClosed = createSelector(
  selectModals,
  (state: ModalState) => state.modalToBeClosed
);