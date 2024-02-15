import { Action, createReducer, on } from "@ngrx/store";
import { ItemUsedState, adapter, initialState } from "./item_used.state";
import { loadTradesUsingTheItemSucceeded } from "./item_used.actions";

export function ItemUsedReducer(
  state: ItemUsedState = initialState,
  action: Action
) {
  return itemUsedReducer(state, action);
}

const itemUsedReducer = createReducer(
  initialState,
  on(loadTradesUsingTheItemSucceeded, (state, { itemTrades }) => adapter.addOne(itemTrades, { ...state }))
)