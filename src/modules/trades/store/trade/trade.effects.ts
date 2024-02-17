import { inject } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { TradesService } from "../../services/trades.service";
import { addTradeData, listTradesInit, listTradesSucceeded, loadTradeDirectionsInit, loadTradeDirectionsSucceeded, loadTradeInit, loadTradeSucceeded, respondTradeInit, respondTradeSucceeded, sendTradeOfferInit, sendTradeOfferSucceeded } from "./trade.actions";
import { catchError, concatMap, exhaustMap, filter, map, mergeMap, of } from "rxjs";
import { Trade } from "../../models/responses/trade";
import { TradesListResponse } from "../../models/responses/trades-list.response";
import { TradeBaseData } from "../../models/trade-base-data";
import { RespondedTradeResponse } from "../../models/responses/responded-trade.response";
import { TradeResponse } from "../../enums/trade-response";
import { NotificationCategoryTypes } from "../../../notification/enums/notification-category-types.enum";
import { changedNotification, createdNotification, handleDefaultException } from "../../../notification/store/notification.actions";


export const listTrades = createEffect(
  (actions$ = inject(Actions), service = inject(TradesService)) => {
    return actions$.pipe(
      ofType(listTradesInit),
      exhaustMap(({ searchOptions }) => 
        service.loadTradeIds(searchOptions.selectedFilterValue, searchOptions.tradeItemIds, searchOptions.showRespondedTrades).pipe(
          map((response: any) => {
            const tradeIds = response as TradesListResponse;

            const tradeOfferIds = [
              ...tradeIds.sentTradeOfferIds?.map(tradeId => new TradeBaseData({ tradeId: tradeId, isSentTrade: true, isRespondedTrade: searchOptions.showRespondedTrades })) ?? [],
              ...tradeIds.receivedTradeOfferIds?.map(tradeId => new TradeBaseData({ tradeId: tradeId, isSentTrade: false, isRespondedTrade: searchOptions.showRespondedTrades })) ?? []
            ];

            return listTradesSucceeded(
              tradeOfferIds
            )
          })
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
      concatMap(({ tradeId }) =>
        service.getTrade(tradeId).pipe(
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

export const loadTradeDirections = createEffect(
  (actions$ = inject(Actions), service = inject(TradesService)) => {
    return actions$.pipe(
      ofType(loadTradeDirectionsInit),
      exhaustMap(() =>
        service.loadTradeDirections().pipe(
          map((httpResponse: any) => 
            loadTradeDirectionsSucceeded(httpResponse as Array<string>)
          ),
          catchError(error =>
            of(handleDefaultException('Error found at loading the trade directions', error))
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
            tradeId: notification.id,
            response: notification.customData.response as boolean | undefined
          });
          
          return of(respondTradeSucceeded(responseObject))
        }
      )
    )
  },
  { functional: true }
);
