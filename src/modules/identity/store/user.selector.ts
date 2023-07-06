import { createFeatureSelector, createSelector } from "@ngrx/store";
import { UserState, adapter } from "./user.state";
import { FoundUserResponse } from "../models/responses/found-user.response";

export const selectUserFeature = createFeatureSelector<UserState>("user");

const {
  selectEntities
} = adapter.getSelectors();

export const selectUsers =
  createSelector(
    selectUserFeature,
    selectEntities,
    (state) => {
      const array = new Array<FoundUserResponse>();
      state.ids.forEach(id => array.push(state.entities[id]));
      return array;
    }
);