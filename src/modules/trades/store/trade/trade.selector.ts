import { createFeatureSelector, createSelector } from "@ngrx/store";
import { TradeState } from "./trade.state";

export const selectTrade = createFeatureSelector<TradeState>("trade");

export const selectTradeCreationStatus = createSelector(
  selectTrade,
  (state: TradeState) => state.createTrade
);

export const selectCurrentTradeStatus = createSelector(
  selectTrade,
  (state: TradeState) => state.currentTrade
);

export const selectTradeIds = createSelector(
  selectTrade,
  (state: TradeState) => state.tradesData
);

export const selectTradeById = (tradeId: string) =>
  createSelector(
    selectTrade,
    (state: TradeState) => state.entities ? state.entities[tradeId] : undefined
);

export const selectedTrade =
  createSelector(
    selectTrade,
    (state: TradeState) => (state.entities && state.currentTrade) ? state.entities[state.currentTrade.tradeId] : undefined
);

export const selectTradeOfferReceiverId =
  createSelector(
    selectTrade,
    (state: TradeState) => (state.tradeOffer.targetUserId)
);

export const selectTradeDirections =
  createSelector(
    selectTrade,
    (state: TradeState) => (state.tradeDirections)
);