import { Item } from "../../models/responses/item";
import { EntityAdapter, EntityState, createEntityAdapter } from "@ngrx/entity";

export interface ItemState extends EntityState<Item> {
  createItem: boolean;
  selectedItem: string;
  itemIds: string[];
}

export const adapter: EntityAdapter<Item> = createEntityAdapter<Item>({
  selectId: (item: Item) => item.id
});

export const initialState: ItemState = adapter.getInitialState({
  createItem: false,
  selectedItem: '',
  itemIds: []
});