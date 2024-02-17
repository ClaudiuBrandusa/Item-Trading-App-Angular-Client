import { EntityAdapter, EntityState, createEntityAdapter } from "@ngrx/entity";
import { CurrentTrade } from "../../models/current-trade";
import { Trade } from "../../models/responses/trade";
import { TradeBaseData } from "../../models/trade-base-data";
import { TradeOfferRequest } from "../../models/requests/trade-offer.request";

export interface TradeState extends EntityState<Trade> {
  createTrade: boolean;
  currentTrade: CurrentTrade;
  tradeOffer: TradeOfferRequest;
  displayRespondedTrades: boolean;
  tradesData: TradeBaseData[];
  tradeDirections: Array<string>;
}

export const adapter: EntityAdapter<Trade> = createEntityAdapter<Trade>({
  selectId: (trade: Trade) => trade.tradeId
});

export const initialState: TradeState = adapter.getInitialState({
  createTrade: false,
  currentTrade: new CurrentTrade(),
  tradeOffer: new TradeOfferRequest(),
  displayRespondedTrades: false,
  tradesData: Array<TradeBaseData>(),
  tradeDirections: Array<string>()
});