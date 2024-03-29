import { createAction } from "@ngrx/store";
import { Trade } from "../../models/responses/trade";
import { TradesSearchOptions } from "../../models/trades-search-options";
import { TradeItem } from "../../models/trade-item";
import { TradeBaseData } from "../../models/trade-base-data";
import { TradeResponse } from "../../enums/trade-response";
import { RespondedTradeResponse } from "../../models/responses/responded-trade.response";
import { TradeOfferRequest } from "../../models/requests/trade-offer.request";

export enum TradeActionType {
  CreateTradeInit = "create_trade_init",
  CreateTradeTerminate = "create_trade_terminate",
  SetTradeReceiver = "set_trade_receiver",
  RemoveTradeReceiver = "remove_trade_receiver",
  CurrentTradeSelectionInit = "current_trade_selection_initialized",
  CurrentTradeSelectionTerminate = "current_trade_selection_terminate",
  SendTradeOfferInit = "send_trade_offer_initiated",
  SendTradeOfferSucceeded = "send_trade_offer_succeeded",
  ListTradesInit = "list_trades_initialized",
  ListTradesSucceeded = "list_trades_succeeded",
  AddTradeData = "add_trade_data",
  LoadTradeInit = "load_trade_initialized",
  LoadTradeSucceeded = "load_trade_succeeded",
  RespondTradeInit = "respond_trade_initialized",
  RespondTradeSucceeded = "respond_trade_succeeded",
  LoadTradeDirectionsInit = "load_trade_directions_initialized",
  LoadTradeDirectionsSucceeded = "load_trade_directions_succeeded"
}

export const createTradeInitiated = createAction(TradeActionType.CreateTradeInit);

export const createTradeTerminated = createAction(TradeActionType.CreateTradeTerminate);

export const setTradeReceiver = createAction(TradeActionType.SetTradeReceiver, (tradeReceiverId: string) => ({ tradeReceiverId }));

export const removeTradeReceiver = createAction(TradeActionType.RemoveTradeReceiver);

export const currentTradeSelectionInitiated = createAction(TradeActionType.CurrentTradeSelectionInit, (tradeId: string, tradeItems: Array<TradeItem>, isSentTrade: boolean, isRespondedTrade: boolean) => ({ tradeId, tradeItems, isSentTrade, isRespondedTrade }));

export const currentTradeSelectionTerminated = createAction(TradeActionType.CurrentTradeSelectionTerminate);

export const sendTradeOfferInit = createAction(TradeActionType.SendTradeOfferInit, (tradeOffer: TradeOfferRequest) => ({ tradeOffer }));

export const sendTradeOfferSucceeded = createAction(TradeActionType.SendTradeOfferSucceeded, (response: Trade) => ({ response }));

export const listTradesInit = createAction(TradeActionType.ListTradesInit, (searchOptions: TradesSearchOptions) => ({ searchOptions }));

export const listTradesSucceeded = createAction(TradeActionType.ListTradesSucceeded, (response: TradeBaseData[]) => ({ response }));

export const addTradeData = createAction(TradeActionType.AddTradeData, (tradeData: TradeBaseData) => ({ tradeData }));

export const loadTradeInit = createAction(TradeActionType.LoadTradeInit, (tradeId: string) => ({ tradeId }));

export const loadTradeSucceeded = createAction(TradeActionType.LoadTradeSucceeded, (trade: Trade) => ({ trade }));

export const respondTradeInit = createAction(TradeActionType.RespondTradeInit, (tradeId: string, response: TradeResponse) => ({ tradeId, response }));

export const respondTradeSucceeded = createAction(TradeActionType.RespondTradeSucceeded, (response: RespondedTradeResponse) => ({ response }));

export const loadTradeDirectionsInit = createAction(TradeActionType.LoadTradeDirectionsInit);

export const loadTradeDirectionsSucceeded = createAction(TradeActionType.LoadTradeDirectionsSucceeded, (response: Array<string>) => ({ response }));