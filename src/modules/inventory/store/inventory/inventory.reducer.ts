import { Action, createReducer, on } from "@ngrx/store";
import { InventoryItemState, adapter, initialState } from "./inventory.state";
import { addItemSucceeded, clearSearchedItems, deselectItem, dropItemSucceeded, loadItemSucceeded, loadItemsSucceeded, selectItem } from "./inventory.actions";
import { disconnected } from "../../../identity/store/identity/identity.actions";

export function InventoryItemReducer(
  state: InventoryItemState = initialState,
  action: Action
) {
  return inventoryItemReducer(state, action);
}

const inventoryItemReducer = createReducer(
  initialState,
  on(loadItemsSucceeded, (state, { itemIds }) => ({ ...state, itemIds: [ ...itemIds ] })),
  on(loadItemSucceeded, (state, { response }) => adapter.addOne(response, state)),
  on(selectItem, (state, { itemId }) => ({ ...state, selectedItemId: itemId })),
  on(deselectItem, (state) => ({ ...state, selectedItemId: initialState.selectedItemId })),
  on(addItemSucceeded, (state, { response }) => {
    if (state.itemIds.includes(response.itemId)) {
      return adapter.updateOne({ id: response.itemId, changes: response }, state);
    } else {
      return adapter.addOne(response, { ...state, itemIds: [ ...state.itemIds, response.itemId ] });
    }
  }),
  on(dropItemSucceeded, (state, { response }) => {
    if (response.quantity === 0) {
      return adapter.removeOne(response, { ...state, itemIds: state.itemIds.filter(x => x !== response.itemId) });
    } else {
      return adapter.updateOne({ id: response.itemId, changes: response }, state);
    }
  }),
  on(clearSearchedItems, (state) => adapter.removeAll({ ...state, itemIds: initialState.itemIds })),
  on(disconnected, () => adapter.removeAll({ ...initialState }))
)