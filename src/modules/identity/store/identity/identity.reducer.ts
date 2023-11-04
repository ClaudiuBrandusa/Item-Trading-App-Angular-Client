import { Action, createReducer, on } from "@ngrx/store";
import { connected, disconnected } from "./identity.actions";
import { IdentityState, initialState } from "./identity.state";

export function IdentityReducer(
  state: IdentityState = initialState,
  action: Action
) {
  return identityReducer(state, action);
}

const identityReducer = createReducer(
  initialState,
  on(connected, (state) => ({ ...state, connected: true })),
  on(disconnected, (state) => ({ ...state, connected: false }))
)