import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Item } from 'src/modules/item/models/responses/item';
import { NavigationService } from '../../../shared/services/navigation.service';
import { Store } from '@ngrx/store';
import { UpdateItemRequest } from '../../models/requests/update-item-request.model';
import { selectCurrentItem } from '../../store/item.selector';
import { deselectItem, updateItemInit } from '../../store/item.actions';

@Component({
  selector: 'dialog-edit-item',
  templateUrl: './edit-item-dialog.component.html',
  styleUrls: ['./edit-item-dialog.component.css']
})
export class EditItemDialogComponent implements OnInit, OnDestroy {

  item: Item = null;
  
  constructor(private fb: FormBuilder, private navigationService: NavigationService, private store: Store<Item>) {}
  
  form = this.fb.group({
    itemId: new FormControl('', Validators.required),
    itemName: new FormControl('', Validators.required),
    itemDescription: new FormControl('', null)
  })
  
  ngOnInit() {
    this.store.select(selectCurrentItem).subscribe((item) => {
      if (item === undefined) {
        this.exit();
        return;
      }

      this.item = item;
      this.form.controls["itemId"].setValue(this.item.id);
      this.form.controls["itemName"].setValue(this.item.name);
      this.form.controls["itemDescription"].setValue(this.item.description);
    });
  }

  ngOnDestroy() {
    this.store.dispatch(deselectItem());
  }

  submit() {
    this.store.dispatch(updateItemInit(this.convertFormToRequest(this.form)));
  }

  exit() {
    this.navigationService.back();
  }

  convertFormToRequest(form: FormGroup) {
    if(form == null) return null;

    let model = new UpdateItemRequest();

    model.itemId = form.get("itemId")?.value;
    model.itemName = form.get('itemName')?.value;
    model.itemDescription = form.get('itemDescription')?.value;

    return model;
  }
}
