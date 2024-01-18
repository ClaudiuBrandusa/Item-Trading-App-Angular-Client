import { createFeatureSelector, createSelector } from "@ngrx/store";
import { InventoryItemState, adapter } from "./inventory.state";
import { selectItemFeature } from "../../../item/store/item/item.selector";
import { ItemState } from "../../../item/store/item/item.state";
import { InventoryItem } from "../../models/responses/inventory-item";
import { selectTradeItemFeature } from "../../../trades/store/trade-item/trade-item.selector";
import { TradeItemState } from "../../../trades/store/trade-item/trade-item.state";

export const selectInventoryItemFeature = createFeatureSelector<InventoryItemState>("inventory");

const {
  selectEntities
} = adapter.getSelectors();

export const selectCurrentInventoryItemId =
  createSelector(
    selectInventoryItemFeature,
    (state: InventoryItemState) => state.selectedItemId
  );

export const selectInventoryItemIds =
  createSelector(
    selectInventoryItemFeature,
    (state: InventoryItemState) => state.itemIds
  );

export const selectInventoryItemIdsThatAreNotSelectedAsTradeItems =
    createSelector(
      selectInventoryItemIds,
      selectTradeItemFeature,
      (itemIds: string[], tradeItemState: TradeItemState) => itemIds.filter(id => !(tradeItemState.ids as string[]).includes(id))
  );

export const selectCurrentItem =
  createSelector(
    selectInventoryItemFeature,
    selectEntities,
    (state) => state.entities[state.selectedItemId]
  );

export const selectInventoryItemsData =
  createSelector(
    selectInventoryItemFeature,
    (state: InventoryItemState) => {
      const array = new Array<InventoryItem>();
      
      state.itemIds.forEach(id => {
        const item = state.entities[id];
        if (!item) return;
        array.push(item);
      });

      return array;
    }
  );

export const selectCurrentItemData =
  createSelector(
    selectCurrentInventoryItemId,
    selectItemFeature,
    (selectedItemId: string, itemState: ItemState) => itemState.entities[selectedItemId || itemState.selectedItem]
  );

export const selectItemById = (itemId: string) =>
  createSelector(
    selectInventoryItemFeature,
    selectEntities,
    (state) => state.entities[itemId]
  );