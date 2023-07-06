import { createAction } from "@ngrx/store";
import { DefaultException } from "../../../shared/models/errors/default-exception";
import { InventoryItem } from "../../models/responses/inventory-item";
import { AddItemRequest } from "../../models/requests/add-item-request.model";
import { DropItemRequest } from "../../models/requests/drop-item-request.model";

export enum InventoryItemActionType {
  LoadItemsInit = "load_inventory_items_initiated",
  LoadItemsSucceeded = "load_inventory_items_succeeded",
  LoadItemInit = "load_inventory_item_initiated",
  LoadItemSucceeded = "load_inventory_item_succeeded",
  SelectItem = "select_inventory_item",
  DeselectItem = "deselect_inventory_item",
  AddItem = "add_inventory_item",
  AddItemSucceeded = "add_inventory_item_succeeded",
  DropItem = "drop_inventory_item",
  DropItemSucceeded = "drop_inventory_item_succeeded",
  ClearSearchedItems = "clear_searched_inventory_items",
  DefaultItemFailedResponse = "default_inventory_item_failed_response"
}

export const loadItemsInit = createAction(InventoryItemActionType.LoadItemsInit, (searchString: string) => ({ searchString }));

export const loadItemsSucceeded = createAction(InventoryItemActionType.LoadItemsSucceeded, ( itemIds: string[] ) => ({ itemIds }));

export const loadItemInit = createAction(InventoryItemActionType.LoadItemInit, (itemId: string) => ({ itemId }));

export const loadItemSucceeded = createAction(InventoryItemActionType.LoadItemSucceeded, (response: InventoryItem) => ({ response }))

export const selectItem = createAction(InventoryItemActionType.SelectItem, (itemId: string) => ({ itemId }));

export const deselectItem = createAction(InventoryItemActionType.DeselectItem);

export const addItem = createAction(InventoryItemActionType.AddItem, (request: AddItemRequest) => ({ request }))

export const addItemSucceeded = createAction(InventoryItemActionType.AddItemSucceeded, (response: InventoryItem) => ({ response }))

export const dropItem = createAction(InventoryItemActionType.DropItem, (request: DropItemRequest) => ({ request }));

export const dropItemSucceeded = createAction(InventoryItemActionType.DropItemSucceeded, (response: any) => ({ response }))

export const clearSearchedItems = createAction(InventoryItemActionType.ClearSearchedItems);

export const defaultItemFailedResponse = createAction(InventoryItemActionType.DefaultItemFailedResponse, (errorMessage: string, errorBody: any) => (new DefaultException({ message: errorMessage, body: errorBody })));