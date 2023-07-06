import { Component, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AddItemRequest } from 'src/modules/inventory/models/requests/add-item-request.model';
import { NavigationService } from '../../../shared/services/navigation.service';
import { InventoryRoutes } from '../../enums/inventory-routes';
import { Store } from '@ngrx/store';
import { clearSearchedItems } from '../../../item/store/item.actions';
import { Item } from '../../../item/models/responses/item';
import { Observable, map } from 'rxjs';
import { InventoryItem } from '../../models/responses/inventory-item';
import { selectCurrentItemData } from '../../store/inventory/inventory.selector';
import { addItem, deselectItem } from '../../store/inventory/inventory.actions';

@Component({
  selector: 'dialog-add-item-quantity',
  templateUrl: './add-item-quantity-dialog.component.html',
  styleUrls: ['./add-item-quantity-dialog.component.css']
})
export class AddItemQuantityDialogComponent implements OnInit, OnDestroy {
  
  model = new AddItemRequest();

  @Output()
  errorMessage: string;

  public item$: Observable<Item>;

  constructor(private fb: FormBuilder, private navigationService: NavigationService, private store: Store<InventoryItem>, private itemStore: Store<Item>) {}
  
  form = this.fb.group({
    itemQuantity: new FormControl('', Validators.required)
  })
  
  ngOnInit() {
    this.item$ = this.store.select(selectCurrentItemData).pipe(map((item) => {
      if (item === undefined) {
        this.exit();
        return new Item();
      }
      this.model.itemId = item.id;
      return item
    }));
  }
  
  ngOnDestroy() {
    this.store.dispatch(deselectItem());
  }

  next() {
    this.store.dispatch(addItem(this.convertFormToRequest(this.form)));
    this.exit();
  }

  exit() {
    this.itemStore.dispatch(clearSearchedItems());
    this.navigationService.backToRoute(InventoryRoutes.Base);
  }

  cancel() {
    this.navigationService.back();
  }

  private convertFormToRequest(form: FormGroup) {
    if(form == null) return null;

    let model = new AddItemRequest();

    model.itemId = this.model.itemId;
    model.quantity = form.get('itemQuantity')?.value;

    return model;
  }
}
