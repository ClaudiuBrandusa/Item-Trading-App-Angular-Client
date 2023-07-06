import { Component, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NavigationService } from '../../../shared/services/navigation.service';
import { Store } from '@ngrx/store';
import { Item } from '../../../item/models/responses/item';
import { Observable, map } from 'rxjs';
import { selectCurrentItemData } from '../../store/inventory/inventory.selector';
import { InventoryItem } from '../../models/responses/inventory-item';
import { deselectItem, dropItem } from '../../store/inventory/inventory.actions';
import { DropItemRequest } from '../../models/requests/drop-item-request.model';

@Component({
  selector: 'dialog-drop-item-quantity',
  templateUrl: './drop-item-quantity-dialog.component.html',
  styleUrls: ['./drop-item-quantity-dialog.component.css']
})
export class DropItemQuantityDialogComponent implements OnInit, OnDestroy {

  @Output()
  itemName: string;

  @Output()
  errorMessage: string;

  public item$: Observable<Item>;

  private itemId: string;

  constructor(private fb: FormBuilder, private navigationService: NavigationService, private store: Store<InventoryItem>) {}

  form = this.fb.group({
    itemQuantity: new FormControl('', Validators.required)
  })

  ngOnInit() {
    this.item$ = this.store.select(selectCurrentItemData).pipe(map((item) => {
      if (item === undefined) {
        this.exit();
        return new Item();
      }
      this.itemId = item.id;
      return item
    }));
  }

  ngOnDestroy() {
    this.store.dispatch(deselectItem());
  }

  next() {
    this.store.dispatch(dropItem(this.convertFormToRequest(this.form)));
    this.exit();
  }

  exit() {
    this.navigationService.back();
  }

  private convertFormToRequest(form: FormGroup) {
    if(form == null) return null;

    let model = new DropItemRequest();

    model.itemId = this.itemId;
    model.itemQuantity = form.get('itemQuantity')?.value;

    return model;
  }
}
