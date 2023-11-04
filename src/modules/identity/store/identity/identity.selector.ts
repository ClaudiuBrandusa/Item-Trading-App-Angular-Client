import { createFeatureSelector, createSelector } from "@ngrx/store";
import { IdentityState } from "./identity.state";

export const selectIdentityFeature = createFeatureSelector<IdentityState>("identity");

export const selectConnected =
  createSelector(
    selectIdentityFeature,
    (state) => state.connected
  );