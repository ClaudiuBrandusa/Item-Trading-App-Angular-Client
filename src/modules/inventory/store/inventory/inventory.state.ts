import { EntityAdapter, EntityState, createEntityAdapter } from "@ngrx/entity";
import { InventoryItem } from "../../models/responses/inventory-item";

export interface InventoryItemState extends EntityState<InventoryItem> {
  selectedItemId: string;
  itemIds: string[];
}

export const adapter: EntityAdapter<InventoryItem> = createEntityAdapter<InventoryItem>({
  selectId: (item: InventoryItem) => item.itemId
});

export const initialState: InventoryItemState = adapter.getInitialState({
  selectedItemId: "",
  itemIds: []
});