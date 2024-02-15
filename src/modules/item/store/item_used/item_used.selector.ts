import { createFeatureSelector, createSelector } from "@ngrx/store";
import { ItemUsedState } from "./item_used.state";

export const selectItemUsedFeature = createFeatureSelector<ItemUsedState>("item_used");

export const selectItemUsedById = (itemId: string) =>
  createSelector(
    selectItemUsedFeature,
    (state) => state.entities[itemId]
  );