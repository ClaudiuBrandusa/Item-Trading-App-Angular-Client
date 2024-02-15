import { CreateItemRequest } from 'src/modules/item/models/requests/create-item-request.model';
import { UpdateItemRequest } from 'src/modules/item/models/requests/update-item-request.model';
import { createAction } from '@ngrx/store';
import { Item } from '../../models/responses/item';

export enum ItemActionType {
  SearchItemByNameInit = "search_item_by_name_initiated",
  SearchItemByNameSucceeded = "search_item_by_name_succeeded",
  LoadItemsInit = "load_items_init",
  LoadItemsSucceeded = "load_items_succeeded",
  LoadItemInit = "load_item_initiated",
  LoadItemSucceeded = "load_item_succeeded",
  ClearSearchedItems = "clear_searched_items",
  CreateItemInit = "create_item_initiated",
  CreateItemTerminate = "create_item_terminate",
  CreateItemRequestSent = "create_item_request_sent",
  CreateItemSucceeded = "create_item_succeeded",
  UpdateItemInit = "update_item_initiated",
  UpdateItemSucceeded = "update_item_succeeded",
  DeleteItemInit = "delete_item_initiated",
  DeleteItemSucceeded = "delete_item_succeeded",
  SelectItem = "select_item",
  DeselectItem = "deselect_item"
}

export const searchItemByNameInit = createAction(ItemActionType.SearchItemByNameInit, (searchString: string) => ({ searchString }));

export const searchItemByNameSucceeded = createAction(ItemActionType.SearchItemByNameSucceeded, (items: Item[]) => ({ items }));

export const loadItemsInitiated = createAction(ItemActionType.LoadItemsInit, (searchString: string) => ({ searchString }));

export const loadItemsSucceeded = createAction(ItemActionType.LoadItemsSucceeded, ({ itemIds }) => ({ itemIds }));

export const loadItemInitiated = createAction(ItemActionType.LoadItemInit, (itemId: string) => ({ itemId }));

export const loadItemSucceeded = createAction(ItemActionType.LoadItemSucceeded, (entity: Item) => ({ entity }))

export const clearSearchedItems = createAction(ItemActionType.ClearSearchedItems);

export const createItemInitiated = createAction(ItemActionType.CreateItemInit);

export const createItemTerminated = createAction(ItemActionType.CreateItemTerminate);

export const createItemRequestSent = createAction(ItemActionType.CreateItemRequestSent, (data: CreateItemRequest) => (data));

export const createItemSucceeded = createAction(ItemActionType.CreateItemSucceeded, (itemId: string) => ({ itemId }));

export const updateItemInit = createAction(ItemActionType.UpdateItemInit, (data: UpdateItemRequest) => (data));

export const updateItemSucceeded = createAction(ItemActionType.UpdateItemSucceeded, (updatedItem: Item) => ({ updatedItem }));

export const deleteItemInitiated = createAction(ItemActionType.DeleteItemInit, (itemId: string) => ({ itemId }));

export const deleteItemSucceeded = createAction(ItemActionType.DeleteItemSucceeded, (itemId: string) => ({ itemId }));

export const selectItem = createAction(ItemActionType.SelectItem, (itemId) => ({ itemId }));

export const deselectItem = createAction(ItemActionType.DeselectItem);