import { createFeatureSelector, createSelector } from "@ngrx/store";
import { ItemState, adapter } from "./item.state";

export const selectItemFeature = createFeatureSelector<ItemState>("item");

const {
  selectEntities
} = adapter.getSelectors();

export const selectItemCreationStatus = createSelector(
  selectItemFeature,
  (state: ItemState) => state.createItem
);

export const selectCurrentItemStatus =
  createSelector(
    selectItemFeature,
    (state: ItemState) => state.selectedItem
);

export const selectItemIds =
  createSelector(
    selectItemFeature,
    (state: ItemState) => state.itemIds
  );

export const selectItemById = (itemId: string) =>
  createSelector(
    selectItemFeature,
    selectEntities,
    (state) => state.entities[itemId]
  );

export const selectCurrentItem =
  createSelector(
    selectItemFeature,
    selectEntities,
    (state: ItemState) => state.entities[state.selectedItem]
  );