import { createFeatureSelector, createSelector } from "@ngrx/store";
import { LockedInventoryItemAmountState } from "./locked-amount.state";

export const selectLockedInventoryItemAmountFeature = createFeatureSelector<LockedInventoryItemAmountState>("locked-amount");

export const selectLockedAmountById = (itemId: string) =>
  createSelector(
    selectLockedInventoryItemAmountFeature,
    (state: LockedInventoryItemAmountState) => state.entities[itemId]
  );