import { EntityAdapter, EntityState, createEntityAdapter } from "@ngrx/entity";
import { TradeItem } from "../../models/trade-item";

export interface TradeItemState extends EntityState<TradeItem> {
  currentTradeItem: TradeItem;
}

export const adapter: EntityAdapter<TradeItem> = createEntityAdapter<TradeItem>({
  selectId: (tradeItem: TradeItem) => tradeItem.id
});

export const initialState: TradeItemState = adapter.getInitialState({
  currentTradeItem: undefined
});