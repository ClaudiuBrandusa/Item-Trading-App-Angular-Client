import { inject } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { UserService } from "../services/user.service";
import { defaultUserFailedResponse, getUserInit, getUserSucceeded, listUsersInit, listUsersSucceeded } from "./user.actions";
import { catchError, concatMap, exhaustMap, map, of, tap } from "rxjs";
import { DefaultException } from "../../shared/models/errors/default-exception";
import { FoundUserResponse } from "../models/responses/found-user.response";
import { Store } from "@ngrx/store";

export const listUsers = createEffect(
  (actions$ = inject(Actions), service = inject(UserService), store = inject(Store<FoundUserResponse>)) => {
    return actions$.pipe(
      ofType(listUsersInit),
      exhaustMap(({ searchString }) =>
        service.listUsers(searchString).pipe(
          map((response: any) => {
            response.usersId.forEach(userId => store.dispatch(getUserInit(userId)));
            return listUsersSucceeded(response.usersId)
          }),
          catchError(error =>
            of(defaultUserFailedResponse('Error found at list users: ', error)))
        )
      )
    )
  },
  { functional: true }
);

export const getUser = createEffect(
  (actions$ = inject(Actions), service = inject(UserService)) => {
    return actions$.pipe(
      ofType(getUserInit),
      concatMap(({ userId }) =>
        service.getUsername(userId).pipe(
          map((response: any) =>
            getUserSucceeded(response)
          ),
          catchError(error =>
            of(defaultUserFailedResponse(`Error at loading user data for id ${userId}: `, error)))
        )
      )
    )
  },
  { functional: true }
);

export const defaultUserError = createEffect(
  (actions$ = inject(Actions)) => {
    return actions$.pipe(
      ofType(defaultUserFailedResponse),
      tap((error: DefaultException) => {
        console.log(error.message, error.body)
      })
    )
  },
  { functional: true, dispatch: false }
);