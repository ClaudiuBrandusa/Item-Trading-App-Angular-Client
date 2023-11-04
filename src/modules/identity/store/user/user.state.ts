import { EntityAdapter, EntityState, createEntityAdapter } from "@ngrx/entity";
import { FoundUserResponse } from "../../models/responses/found-user.response";

export interface UserState extends EntityState<FoundUserResponse> {}

export const adapter: EntityAdapter<FoundUserResponse> = createEntityAdapter<FoundUserResponse>({
  selectId: (user: FoundUserResponse) => user.userId
});

export const initialState: UserState = adapter.getInitialState();