import { Action, createReducer, on } from "@ngrx/store";
import { TradeState, adapter, initialState } from "./trade.state";
import { addTradeData, createTradeInitiated, createTradeTerminated, currentTradeSelectionInitiated, currentTradeSelectionTerminated, listTradesSucceeded, loadTradeSucceeded, removeTradeReceiver, respondTradeSucceeded, sendTradeOfferSucceeded, setTradeReceiver } from "./trade.actions";
import { CurrentTrade } from "../../models/current-trade";
import { TradeBaseData } from "../../models/trade-base-data";
import { disconnected } from "../../../identity/store/identity/identity.actions";

export function TradeReducer(
  state: TradeState = initialState,
  action: Action
) {
  return tradeReducer(state, action);
}

const tradeReducer = createReducer(
  initialState,
  on(createTradeInitiated, (state) => ({ ...state, createTrade: true })),
  on(createTradeTerminated, (state) => ({ ...state, createTrade: initialState.createTrade })),
  on(setTradeReceiver, (state, { tradeReceiverId }) => ({ ...state, tradeOffer: { ...state.tradeOffer, targetUserId: tradeReceiverId } })),
  on(removeTradeReceiver, (state) => ({ ...state, tradeOffer: { ...state.tradeOffer, targetUserId: initialState.tradeOffer.targetUserId} })),
  on(sendTradeOfferSucceeded, (state, { response }) => adapter.addOne(response, { ...state, tradesData: [ ...state.tradesData, new TradeBaseData({ tradeId: response.tradeId, isSentTrade: true, isRespondedTrade: false }) ], createTrade: initialState.createTrade })),
  on(currentTradeSelectionInitiated, (state, { tradeId, tradeItems, isSentTrade, isRespondedTrade }) => ({...state, currentTrade: new CurrentTrade({ tradeId: tradeId, tradeItems: tradeItems, isSentTrade, isRespondedTrade }) })),
  on(currentTradeSelectionTerminated, (state) => ({ ...state, currentTrade: new CurrentTrade() })),
  on(listTradesSucceeded, (state, { response }) => ({ ...state, tradesData: [ ...response ], displayRespondedTrades: response.length > 0 ? response[0].isRespondedTrade : initialState.displayRespondedTrades })),
  on(addTradeData, (state, { tradeData }) => ({ ...state, tradesData: [ ...state.tradesData, tradeData ]})),
  on(loadTradeSucceeded, (state, { trade }) => adapter.addOne(trade, state)),
  on(respondTradeSucceeded, (state, { response }) => {
    const tradeId = response.id ?? (response as any).tradeOfferId
    const filteredTradesData = state.tradesData.filter(x => x.tradeId !== tradeId);
    
    if (response.response == null) return adapter.removeOne(tradeId, { ...state, tradesData: [ ...filteredTradesData ] })
    const tradeData = state.tradesData.find(x => x.tradeId === tradeId);
    
    let newTradesData: Array<TradeBaseData>;
    if (tradeData && state.displayRespondedTrades) {
      newTradesData = [ ...filteredTradesData, { ...tradeData, isRespondedTrade: true } ];
    } else {
      newTradesData = [ ...filteredTradesData ];
    }
    return adapter.updateOne({ id: tradeId, changes: { ...state.entities[tradeId], response: response.response } }, { ...state, tradesData: [ ...newTradesData ]})
  }),
  on(disconnected, () => adapter.removeAll({ ...initialState }))
);