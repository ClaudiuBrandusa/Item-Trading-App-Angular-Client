import { inject } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { TradesService } from "../../services/trades.service";
import { addTradeData, listReceivedTrades, listSentTrades, listTradesInit, listTradesSucceeded, loadTradeInit, loadTradeSucceeded, respondTradeInit, respondTradeSucceeded, sendTradeOfferInit, sendTradeOfferSucceeded } from "./trade.actions";
import { catchError, combineLatest, concatMap, exhaustMap, filter, map, mergeMap, of } from "rxjs";
import { Trade } from "../../models/responses/trade";
import { TradesListResponse } from "../../models/responses/trades-list.response";
import { TradeBaseData } from "../../models/trade-base-data";
import { RespondedTradeResponse } from "../../models/responses/responded-trade.response";
import { TradeResponse } from "../../enums/trade-response";
import { changedNotification, createdNotification, handleDefaultException } from "../../../shared/store/notification/notification.actions";
import { NotificationCategoryTypes } from "../../../shared/enums/notification-category-types.enum";

export const listTrades = createEffect(
  (actions$ = inject(Actions), service = inject(TradesService)) => {
    return actions$.pipe(
      ofType(listTradesInit),
      exhaustMap(({ searchOptions }) => {
        if (searchOptions.selectedFilterValue === "All") {
          return combineLatest(
            [
              service.getSentTrades(searchOptions.showRespondedTrades).pipe(map((response: any) => ({ ...response, isSentTrade: true }))),
              service.getReceivedTrades(searchOptions.showRespondedTrades).pipe(map((response: any) => ({ ...response, isSentTrade: false })))
            ]
          ).pipe(
            map((responses: any[]) => {
              return listTradesSucceeded(
                responses.map((response: any) => (response as TradesListResponse).tradeOffersIds.map(tradeId => new TradeBaseData({ tradeId: tradeId, isSentTrade: response.isSentTrade, isRespondedTrade: searchOptions.showRespondedTrades }))).reduce((a, b) => a.concat(b))
              )
            }),
            catchError(error =>
              of(handleDefaultException("Something went wrong while loading the trades", error))
            )
          )
        } else if (searchOptions.selectedFilterValue === "Sent") {
          return of(listSentTrades(searchOptions.showRespondedTrades))
        } else if (searchOptions.selectedFilterValue === "Received") {
          return of(listReceivedTrades(searchOptions.showRespondedTrades))
        } else {
          return of(handleDefaultException("Unknown search options selection filter", searchOptions))
        }
      })
    )
  },
  { functional: true }
);

export const loadSentTrades = createEffect(
  (actions$ = inject(Actions), service = inject(TradesService)) => {
    return actions$.pipe(
      ofType(listSentTrades),
      exhaustMap(({ loadRespondedTrades }) =>
        service.getSentTrades(loadRespondedTrades).pipe(
          map((response: any) =>
            listTradesSucceeded(
              (response as TradesListResponse).tradeOffersIds.map(tradeId => new TradeBaseData({ tradeId: tradeId, isSentTrade: true, isRespondedTrade: loadRespondedTrades }))
            )
          ),
          catchError(error =>
            of(handleDefaultException("Error found at loading the sent trades", error))
          )
        )
      )
    )
  },
  { functional: true }
);

export const loadReceivedTrades = createEffect(
  (actions$ = inject(Actions), service = inject(TradesService)) => {
    return actions$.pipe(
      ofType(listReceivedTrades),
      exhaustMap(({ loadRespondedTrades }) =>
        service.getReceivedTrades(loadRespondedTrades).pipe(
          map((response: any) =>
            listTradesSucceeded(
              (response as TradesListResponse).tradeOffersIds.map(tradeId => new TradeBaseData({ tradeId: tradeId, isSentTrade: false, isRespondedTrade: loadRespondedTrades }))
            )
          ),
          catchError(error =>
            of(handleDefaultException("Error found at loading the received trades", error))
          )
        )
      )
    )
  },
  { functional: true }
);

export const loadTrade = createEffect(
  (actions$ = inject(Actions), service = inject(TradesService)) => {
    return actions$.pipe(
      ofType(loadTradeInit),
      concatMap(({ tradeId, isSentTrade, isRespondedTrade }) =>
        service.getTrade(tradeId, isSentTrade, isRespondedTrade).pipe(
          map((response: any) =>
            loadTradeSucceeded(response as Trade)
          ),
          catchError(error =>
            of(handleDefaultException(`Error found at loading trade with id '${tradeId}'`, error))
          )
        )
      )
    );
  },
  { functional: true }
);

export const sendTradeOffer = createEffect(
  (actions$ = inject(Actions), service = inject(TradesService)) => {
    return actions$.pipe(
      ofType(sendTradeOfferInit),
      exhaustMap(({ tradeOffer }) =>
        service.sendTradeOffer(tradeOffer).pipe(
          map((response: any) =>
            sendTradeOfferSucceeded(response as Trade)
          ),
          catchError(error =>
            of(handleDefaultException('Error found at sending the trade offer', error))
          )
        )
      )
    );
  },
  { functional: true }
);

export const respondTrade = createEffect(
  (actions$ = inject(Actions), service = inject(TradesService)) => {
    return actions$.pipe(
      ofType(respondTradeInit),
      exhaustMap(({ tradeId, response }) =>
        service.respondToTradeOffer(tradeId, response).pipe(
          map((httpResponse: any) => {
            const result = httpResponse as RespondedTradeResponse;
            result.response = response === TradeResponse.Accept ? true : response === TradeResponse.Reject ? false : undefined;
            return respondTradeSucceeded(result);
          }),
          catchError(error =>
            of(handleDefaultException(`Error found at responding to trade with id '${tradeId}'`, error))
          )
        )
      )
    );
  },
  { functional: true }
);

// notification effects

export const createdNotificationEffect = createEffect(
  (actions$ = inject(Actions)) => {
    return actions$.pipe(
      ofType(createdNotification),
      map(action => action.notification),
      filter(notification => notification.category == NotificationCategoryTypes.Trade),
      mergeMap(( notification: any ) => 
        of(addTradeData(new TradeBaseData({ tradeId: notification.id, isSentTrade: false, isRespondedTrade: false })))
      )
    )
  },
  { functional: true }
);

export const changedNotificationEffect = createEffect(
  (actions$ = inject(Actions)) => {
    return actions$.pipe(
      ofType(changedNotification),
      map(action => action.notification),
      filter(notification => notification.category == NotificationCategoryTypes.Trade),
      mergeMap(( notification: any ) => {
        const responseObject = new RespondedTradeResponse(
          {
            id: notification.id,
            response: notification.customData.response as boolean | undefined
          });
          
          return of(respondTradeSucceeded(responseObject))
        }
      )
    )
  },
  { functional: true }
);
