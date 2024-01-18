import { createAction } from "@ngrx/store";
import { ItemTrades } from "../../models/item-trades";

export enum ItemUsedActionType {
  LoadTradesUsingTheItemInit = "load_trades_using_the_item_init",
  LoadTradesUsingTheItemSucceeded = "load_trades_using_the_item_succeeded"
}

export const loadTradesUsingTheItemInit = createAction(ItemUsedActionType.LoadTradesUsingTheItemInit, (itemId) => ({ itemId }));

export const loadTradesUsingTheItemSucceeded = createAction(ItemUsedActionType.LoadTradesUsingTheItemSucceeded, (itemTrades: ItemTrades) => ({ itemTrades }));