import { Component, ComponentRef, ViewChild, ViewContainerRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { selectModalComponentToBeClosed, selectModalComponentToBeOpen } from './store/modal.selector';
import { modalConfigs } from './modals.data';
import { openPopupSucceeded, closePopupSucceeded } from './store/modal.actions';

@Component({
  selector: 'app-modal-manager',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-manager.component.html'
})
export class ModalManagerComponent {
  @ViewChild("viewRef", { read: ViewContainerRef }) viewContainerRef!: ViewContainerRef;
  
  private activeModals = new Map<string, ComponentRef<object>>();

  constructor(private store: Store) {
    store.select(selectModalComponentToBeOpen).subscribe(popupName => {
      if (popupName.length == 0) return;

      const modal = modalConfigs.find(config => config.name === popupName);
  
      if (!modal) return;

      this.activeModals.set(popupName, this.viewContainerRef.createComponent(modal.component));
      this.store.dispatch(openPopupSucceeded());
    });

    store.select(selectModalComponentToBeClosed).subscribe(popupName => {
      const modal = this.activeModals.get(popupName);
      if (!modal) return;

      modal.destroy();
      this.activeModals.delete(popupName);
      this.store.dispatch(closePopupSucceeded());
    });
  }
}
