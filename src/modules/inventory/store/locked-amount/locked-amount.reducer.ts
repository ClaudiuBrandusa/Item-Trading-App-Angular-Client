import { Action, createReducer, on } from "@ngrx/store";
import { LockedInventoryItemAmountState, adapter, initialState } from "./locked-amount.state";
import { loadInventoryItemLockedAmountSucceeded } from "./locked-amount.actions";
import { disconnected } from "../../../identity/store/identity/identity.actions";

export function LockedInventoryItemAmountReducer(
  state: LockedInventoryItemAmountState = initialState,
  action: Action
) {
  return lockedInventoryItemAmountReducer(state, action);
}

const lockedInventoryItemAmountReducer = createReducer(
  initialState,
  on(loadInventoryItemLockedAmountSucceeded, (state, { entity }) => adapter.addOne(entity, state)),
  on(disconnected, () => adapter.removeAll({ ...initialState }))
);