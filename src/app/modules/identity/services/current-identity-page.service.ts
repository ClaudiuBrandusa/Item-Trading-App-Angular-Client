import { Injectable } from '@angular/core';
import { IdentityPage } from 'src/app/models/enums/identity-page';

@Injectable()
export class CurrentIdentityPageService {
  currentPage: IdentityPage = 0;

  constructor() { }

  setPage(page: IdentityPage) {
    this.currentPage = page;
  }
}
