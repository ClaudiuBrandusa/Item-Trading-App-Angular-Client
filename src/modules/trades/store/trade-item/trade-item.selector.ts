import { createFeatureSelector, createSelector } from "@ngrx/store";
import { TradeItemState } from "./trade-item.state";

export const selectTradeItemFeature = createFeatureSelector<TradeItemState>("trade-item");

export const selectCurrentTradeItem = createSelector(
  selectTradeItemFeature,
  (state: TradeItemState) => state.currentTradeItem
);

export const selectTradeItemIds = createSelector(
  selectTradeItemFeature,
  (state: TradeItemState) => state.ids as string[]
);

export const selectTradeItems = createSelector(
  selectTradeItemFeature,
  selectTradeItemIds,
  (state: TradeItemState, ids: string[]) => ids.map(id => state.entities[id])
);

export const selectTradeItemById = (tradeItemId: string) =>
  createSelector(
    selectTradeItemFeature,
    (state: TradeItemState) => state.entities[tradeItemId]
);