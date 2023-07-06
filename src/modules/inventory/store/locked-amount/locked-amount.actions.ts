import { createAction } from "@ngrx/store";
import { LockedInventoryItemAmount } from "../../models/responses/locked-inventory-item-amount.response";
import { DefaultException } from "../../../shared/models/errors/default-exception";

export enum LockedInventoryItemAmountActionType {
  LoadInventoryItemLockedAmountInit = "load_inventory_item_locked_amount_initiated",
  LoadInventoryItemLockedAmountSucceeded = "load_inventory_item_locked_amount_succeeded",
  ClearInventoryItemLockedAmount = "clear_inventory_item_locked_amount",
  DefaultInventoryItemLockedAmountFailedResponse = "default_inventory_item_locked_amount_failed_response"
}

export const loadInventoryItemLockedAmountInit = createAction(LockedInventoryItemAmountActionType.LoadInventoryItemLockedAmountInit, (itemId: string) => ({ itemId }));

export const loadInventoryItemLockedAmountSucceeded = createAction(LockedInventoryItemAmountActionType.LoadInventoryItemLockedAmountSucceeded, (entity: LockedInventoryItemAmount) => ({ entity }));

export const clearInventoryItemLockedAmount = createAction(LockedInventoryItemAmountActionType.ClearInventoryItemLockedAmount);

export const defaultInventoryItemLockedAmountFailedResponse = createAction(LockedInventoryItemAmountActionType.DefaultInventoryItemLockedAmountFailedResponse, (errorMessage: string, errorBody: any) => (new DefaultException({ message: errorMessage, body: errorBody })));