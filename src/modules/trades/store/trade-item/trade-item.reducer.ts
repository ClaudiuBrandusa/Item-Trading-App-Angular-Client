import { Action, createReducer, on } from "@ngrx/store";
import { TradeItemState, adapter, initialState } from "./trade-item.state";
import { addTradeItem, addTradeItems, deselectTradeItem, discardTradeItems, removeTradeItem, selectTradeItem } from "./trade-item.actions";

export function TradeItemReducer(
  state: TradeItemState = initialState,
  action: Action
) {
  return tradeItemReducer(state, action);
};

const tradeItemReducer = createReducer(
  initialState,
  on(selectTradeItem, (state, { tradeItem }) => ({ ...state, currentTradeItem: tradeItem })),
  on(deselectTradeItem, (state) => ({ ...state, currentTradeItem: initialState.currentTradeItem })),
  on(addTradeItem, (state, { tradeItem }) => {
    if ((state.ids as string[]).includes(tradeItem.id)) {
      return adapter.updateOne({ id: tradeItem.id, changes: { ...tradeItem } }, state);
    } else {
      return adapter.addOne(tradeItem, state);
    }
  }),
  on(addTradeItems, (state, { tradeItems }) => adapter.addMany(tradeItems, state)),
  on(removeTradeItem, (state, { tradeItem }) => adapter.removeOne(tradeItem.id, state)),
  on(discardTradeItems, (state) => adapter.removeAll({ ...state, currentTradeItem: initialState.currentTradeItem }))
);