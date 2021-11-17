import { Component, Input } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ItemService } from '../../services/item.service';

@Component({
  selector: 'dialog-create-item',
  templateUrl: './create-item-dialog.component.html',
  styleUrls: ['./create-item-dialog.component.css']
})
export class CreateItemDialogComponent {

  constructor(private fb: FormBuilder, private service: ItemService) { }

  form = this.fb.group({
    itemName: new FormControl('', Validators.required),
    itemDescription: new FormControl('', null)
  });

  async submit() {
    await this.service.waitUntilIsLoaded();
    await this.service.createItem();
    this.form.reset();
  }
}
