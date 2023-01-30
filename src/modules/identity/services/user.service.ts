import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { ConfigService } from '../../shared/services/config.service';
import { EventBusService } from '../../shared/services/event-bus.service';
import { IdentityService } from './identity.service';

@Injectable({
  providedIn: 'root'
})
export class UserService extends IdentityService {

  constructor(protected http: HttpClient, protected configService: ConfigService, protected injector: Injector, protected eventBus: EventBusService, protected router: Router, private eventBusService: EventBusService) {
    super(http, configService, injector, eventBus, router);
  }

  async listUsers(searchString: string) {
    await this.waitUntilIsLoaded();

    return this.http.get(this.base_path + this.endpointsModel.list_users + `?searchString=${searchString}`).pipe(catchError((error) => throwError(() => (this.buildError(error)))));
  }

  async getUsername(userId: string) {
    await this.waitUntilIsLoaded();

    return this.http.get(this.base_path + this.endpointsModel.get_username + `?userId=${userId}`).pipe(catchError((error) => throwError(() => (this.buildError(error)))));
  }

  protected async LoadEndpoints() {
    await this.waitUntilIsLoaded();

    if(this.endpointsModel == null)
      return;
  }
}
