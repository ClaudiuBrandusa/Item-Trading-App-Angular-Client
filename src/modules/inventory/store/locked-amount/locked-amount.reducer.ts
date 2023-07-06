import { Action, createReducer, on } from "@ngrx/store";
import { LockedInventoryItemAmountState, adapter, initialState } from "./locked-amount.state";
import { clearInventoryItemLockedAmount, loadInventoryItemLockedAmountSucceeded } from "./locked-amount.actions";

export function LockedInventoryItemAmountReducer(
  state: LockedInventoryItemAmountState = initialState,
  action: Action
) {
  return lockedInventoryItemAmountReducer(state, action);
}

const lockedInventoryItemAmountReducer = createReducer(
  initialState,
  on(loadInventoryItemLockedAmountSucceeded, (state, { entity }) => adapter.addOne(entity, state)),
  on(clearInventoryItemLockedAmount, (state) => adapter.removeAll(state))
);