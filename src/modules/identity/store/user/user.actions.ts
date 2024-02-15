import { createAction } from "@ngrx/store";
import { FoundUserResponse } from "../../models/responses/found-user.response";

export enum UserActionType {
  ListUsersInit = "list_users_initiated",
  ListUsersSucceeded = "list_users_succeeded",
  GetUserInit = "get_user_initiated",
  GetUserSucceeded = "get_user_succeeded",
  ClearUsersList = "clear_users_list"
}

export const listUsersInit = createAction(UserActionType.ListUsersInit, (searchString: string) => ({ searchString }));

export const listUsersSucceeded = createAction(UserActionType.ListUsersSucceeded, (userIds: string[]) => ({ userIds }));

export const getUserInit = createAction(UserActionType.GetUserInit, (userId: string) => ({ userId }));

export const getUserSucceeded = createAction(UserActionType.GetUserSucceeded, (foundUser: FoundUserResponse) => ({ foundUser }));

export const clearUsersList = createAction(UserActionType.ClearUsersList);