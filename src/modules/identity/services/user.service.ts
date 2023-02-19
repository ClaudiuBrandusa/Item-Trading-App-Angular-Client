import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { EndpointsService } from '../../app/services/endpoints.service';
import { EventBusService } from '../../shared/services/event-bus.service';
import { NavigationService } from '../../shared/services/navigation.service';
import { IdentityService } from './identity.service';

@Injectable({
  providedIn: 'root'
})
export class UserService extends IdentityService {

  constructor(protected http: HttpClient, protected endpointsService: EndpointsService, protected eventBus: EventBusService, protected navigationService: NavigationService) {
    super(http, endpointsService, eventBus, navigationService);
  }

  listUsers(searchString: string) {
    return this.http.get(this.base_path + this.endpointsModel.list_users + `?searchString=${searchString}`).pipe(catchError((error) => throwError(() => (this.buildError(error)))));
  }

  getUsername(userId: string) {
    return this.http.get(this.base_path + this.endpointsModel.get_username + `?userId=${userId}`).pipe(catchError((error) => throwError(() => (this.buildError(error)))));
  }
}
