import { createAction } from "@ngrx/store";
import { LockedInventoryItemAmount } from "../../models/responses/locked-inventory-item-amount.response";

export enum LockedInventoryItemAmountActionType {
  LoadInventoryItemLockedAmountInit = "load_inventory_item_locked_amount_initiated",
  LoadInventoryItemLockedAmountSucceeded = "load_inventory_item_locked_amount_succeeded"
}

export const loadInventoryItemLockedAmountInit = createAction(LockedInventoryItemAmountActionType.LoadInventoryItemLockedAmountInit, (itemId: string) => ({ itemId }));

export const loadInventoryItemLockedAmountSucceeded = createAction(LockedInventoryItemAmountActionType.LoadInventoryItemLockedAmountSucceeded, (entity: LockedInventoryItemAmount) => ({ entity }));