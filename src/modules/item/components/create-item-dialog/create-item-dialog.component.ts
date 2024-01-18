import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NavigationService } from '../../../shared/services/navigation.service';
import { Store } from '@ngrx/store';
import { CreateItemRequest } from '../../models/requests/create-item-request.model';
import { createItemRequestSent, createItemTerminated } from '../../store/item/item.actions';
import { Item } from '../../models/responses/item';

@Component({
  selector: 'dialog-create-item',
  templateUrl: './create-item-dialog.component.html',
  styleUrls: ['./create-item-dialog.component.css']
})
export class CreateItemDialogComponent implements OnDestroy {

  constructor(private fb: FormBuilder, private navigationService: NavigationService, private store: Store<Item>) {}
  
  ngOnDestroy() {
    this.store.dispatch(createItemTerminated());
  }

  form = this.fb.group({
    itemName: new FormControl('', Validators.required),
    itemDescription: new FormControl('', null)
  });

  submit() {
    this.store.dispatch(createItemRequestSent(this.convertFormToRequest(this.form)));
  }
  
  exit() {
    this.navigationService.back();
  }
  
  convertFormToRequest(form: FormGroup) {
    if(form == null) return null;

    let model = new CreateItemRequest();

    model.itemName = form.value['itemName'];
    model.itemDescription = form.value['itemDescription'];

    return model;
  }
}
