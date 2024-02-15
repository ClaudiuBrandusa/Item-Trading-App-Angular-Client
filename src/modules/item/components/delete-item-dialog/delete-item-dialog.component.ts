import { Component, OnDestroy, OnInit } from '@angular/core';
import { Item } from 'src/modules/item/models/responses/item';
import { NavigationService } from '../../../shared/services/navigation.service';
import { Store } from '@ngrx/store';
import { deleteItemInitiated, deselectItem } from '../../store/item/item.actions';
import { selectCurrentItem } from '../../store/item/item.selector';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'dialog-delete-item',
  templateUrl: './delete-item-dialog.component.html',
  styleUrls: ['./delete-item-dialog.component.css']
})
export class DeleteItemDialogComponent implements OnInit, OnDestroy {
  
  public item$: Observable<Item>;

  private itemId: string;

  constructor(private navigationService: NavigationService, private store: Store<Item>) {}
  
  ngOnInit() {
    this.item$ = this.store.select(selectCurrentItem).pipe(map(item => {
      this.itemId = item?.id ?? "";
      return item;
    }));
  }

  ngOnDestroy() {
    this.store.dispatch(deselectItem());
  }
  
  // response functions

  delete() {
    if(this.itemId === undefined || this.itemId.length === 0) return;

    this.store.dispatch(deleteItemInitiated(this.itemId));
  }

  exit() {
    this.navigationService.back();
  }
}
