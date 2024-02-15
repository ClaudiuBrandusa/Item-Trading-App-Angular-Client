import { createAction } from "@ngrx/store";
import { TradeItem } from "../../models/trade-item";

export enum TradeItemActionType {
  SelectTradeItem = "select_trade_item",
  DeselectTradeItem = "deselect_trade_item",
  AddTradeItem = "add_trade_item",
  AddTradeItems = "add_trade_items",
  RemoveTradeItem = "remove_trade_item",
  DiscardTradeItems = "discard_trade_items"
}

export const selectTradeItem = createAction(TradeItemActionType.SelectTradeItem, (tradeItem: TradeItem) => ({ tradeItem }));

export const deselectTradeItem =  createAction(TradeItemActionType.DeselectTradeItem);

export const addTradeItem = createAction(TradeItemActionType.AddTradeItem, (tradeItem: TradeItem) => ({ tradeItem }));

export const addTradeItems = createAction(TradeItemActionType.AddTradeItems, (tradeItems: TradeItem[]) => ({ tradeItems }));

export const removeTradeItem = createAction(TradeItemActionType.RemoveTradeItem, (tradeItem: TradeItem) => ({ tradeItem }));

export const discardTradeItems = createAction(TradeItemActionType.DiscardTradeItems);