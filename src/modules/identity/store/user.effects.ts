import { inject } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { UserService } from "../services/user.service";
import { getUserInit, getUserSucceeded, listUsersInit, listUsersSucceeded } from "./user.actions";
import { catchError, concatMap, exhaustMap, map, of, tap } from "rxjs";
import { FoundUserResponse } from "../models/responses/found-user.response";
import { Store } from "@ngrx/store";
import { handleDefaultException } from "../../shared/store/notification/notification.actions";

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
            of(handleDefaultException('Error found at list users', error)))
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
            of(handleDefaultException(`Error at loading user data for id ${userId}`, error)))
        )
      )
    )
  },
  { functional: true }
);
