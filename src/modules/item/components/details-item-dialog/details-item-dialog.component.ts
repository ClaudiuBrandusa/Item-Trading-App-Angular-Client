import { Component, OnDestroy, OnInit } from '@angular/core';
import { Item } from 'src/modules/item/models/responses/item';
import { NavigationService } from '../../../shared/services/navigation.service';
import { Store } from '@ngrx/store';
import { deselectItem } from '../../store/item/item.actions';
import { selectCurrentItem } from '../../store/item/item.selector';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'dialog-details-item',
  templateUrl: './details-item-dialog.component.html',
  styleUrls: ['./details-item-dialog.component.css']
})
export class DetailsItemDialogComponent implements OnInit, OnDestroy {

  public item$: Observable<Item>;

  constructor(private navigationService: NavigationService, private store: Store<Item>) {}
  
  ngOnInit() {
    this.item$ = this.store.select(selectCurrentItem).pipe(map(item => {
      if (!item) {
        this.exit();
        return new Item();
      }

      return item;
    }));
  }

  ngOnDestroy() {
    this.store.dispatch(deselectItem());
  }

  exit() {
    this.navigationService.back();
  }
}
