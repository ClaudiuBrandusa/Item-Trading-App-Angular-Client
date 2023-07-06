import { EntityAdapter, EntityState, createEntityAdapter } from "@ngrx/entity";
import { LockedInventoryItemAmount } from "../../models/responses/locked-inventory-item-amount.response";

export interface LockedInventoryItemAmountState extends EntityState<LockedInventoryItemAmount> {}

export const adapter: EntityAdapter<LockedInventoryItemAmount> = createEntityAdapter<LockedInventoryItemAmount>({
  selectId: (amount: LockedInventoryItemAmount) => amount.itemId
});

export const initialState: LockedInventoryItemAmountState = adapter.getInitialState();