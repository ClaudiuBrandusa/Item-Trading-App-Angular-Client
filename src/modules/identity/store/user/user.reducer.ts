import { Action, createReducer, on } from "@ngrx/store";
import { UserState, adapter, initialState } from "./user.state";
import { clearUsersList, getUserSucceeded } from "./user.actions";

export function UserReducer(
  state: UserState = initialState,
  action: Action
) {
  return userReducer(state, action);
}

const userReducer = createReducer(
  initialState,
  on(getUserSucceeded, (state, { foundUser }) => adapter.addOne(foundUser, state)),
  on(clearUsersList, (state) => adapter.removeAll(state))
);