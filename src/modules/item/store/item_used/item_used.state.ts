import { EntityAdapter, EntityState, createEntityAdapter } from "@ngrx/entity";
import { ItemTrades } from "../../models/item-trades";

export interface ItemUsedState extends EntityState<ItemTrades> {}

export const adapter: EntityAdapter<ItemTrades> = createEntityAdapter<ItemTrades>({
  selectId: (itemTrades: ItemTrades) => itemTrades.itemId
});

export const initialState: ItemUsedState = adapter.getInitialState();