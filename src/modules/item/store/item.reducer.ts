import { Action, createReducer, on } from "@ngrx/store";
import { clearSearchedItems, createItemInitiated, createItemSucceeded, createItemTerminated, deleteItemSucceeded, deselectItem, loadItemSucceeded, loadItemsSucceeded, selectItem, updateItemSucceeded } from "./item.actions";
import { ItemState, adapter, initialState } from "./item.state";
import { disconnected } from "../../identity/store/identity/identity.actions";

export function ItemReducer(
  state: ItemState = initialState,
  action: Action
) {
  return itemReducer(state, action);
}

const itemReducer = createReducer(
  initialState,
  on(loadItemsSucceeded, (state, { itemIds }) => ({ ...state, itemIds: [ ...itemIds ] })),
  on(loadItemSucceeded, (state, { entity }) => adapter.addOne(entity, state)),
  on(clearSearchedItems, (state) => {
    return ({ ...state, itemIds: initialState.itemIds })
  }),
  on(createItemInitiated, (state) => ({ ...state, createItem: true })),
  on(createItemTerminated, (state) => ({ ...state, createItem: initialState.createItem })),
  on(selectItem, (state, { itemId }) => ({ ...state, selectedItem: itemId })),
  on(deselectItem, (state) => ({ ...state, selectedItem: initialState.selectedItem })),
  on(createItemSucceeded, (state, { itemId }) => ({ ...state, itemIds: [ ...state.itemIds, itemId ] })),
  on(updateItemSucceeded, (state, { updatedItem }) => adapter.updateOne({ id: updatedItem.id, changes: updatedItem }, state)),
  on(deleteItemSucceeded, (state, { itemId }) => adapter.removeOne(itemId, { ...state, itemIds: state.itemIds.filter(id => id !== itemId) })),
  on(disconnected, () => adapter.removeAll({ ...initialState }))
)