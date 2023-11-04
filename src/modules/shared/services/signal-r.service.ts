import { Injectable, OnDestroy } from '@angular/core';
import * as signalR from "@microsoft/signalr"
import { EventBusUtils } from '../utils/event-bus.utility';
import { CustomHttpClient } from '../utils/custom-http-client';
import { RefreshTokenService } from '../../identity/services/refresh-token.service';
import { SignalRNotification } from '../models/signal-r/signal-r-notification';
import { NetworkService } from './network.service';
import { SignalREndpoints } from '../models/endpoints/signal-r-endpoints.config';
import { EndpointsService } from '../../app/services/endpoints.service';
import { SignalREvents } from '../enums/signal-r-events.enum';
import { Store } from '@ngrx/store';
import { handleReceivedNotification } from '../store/notification/notification.actions';

@Injectable({
  providedIn: 'root'
})
export class SignalRService extends NetworkService<SignalREndpoints> implements OnDestroy {

  private hubConnection: signalR.HubConnection;
  private eventBusUtility: EventBusUtils;
  private connectionStatus: Boolean;
  private httpClient: CustomHttpClient;
  private endpoints: SignalREndpoints;
  
  constructor(protected endpointsService: EndpointsService, private refreshTokenService: RefreshTokenService, private store: Store) {
    super(endpointsService);
    this.endpoints = endpointsService.getSignalR();
    this.httpClient = new CustomHttpClient(refreshTokenService);
  }

  ngOnDestroy() {
    this.eventBusUtility.clearSubscriptions();
  }

  public connect(token: string) {
    if (!!!token || this.refreshTokenService.canRefreshTokens()) return;
    if (this.hubConnection && this.connectionStatus) return;
    this.connectionStatus = true;
    this.startConnection(token);
    this.addConnectListener();
  }

  public async disconnect(token: string) {
    if(!this.connectionStatus) {
      return;
    }
    this.connectionStatus = false;
    this.httpClient.setToken(token);

    if (this.hubConnection) {
      await this.hubConnection.stop();
    }
  }

  startConnection = (token: string) => {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(this.endpoints.hub, {
        transport: signalR.HttpTransportType.LongPolling,
        headers: {
          'Authorization': `Bearer ${token}`
        },
        httpClient: this.httpClient
      })
      .build();
      
      this.hubConnection
        .start()
        .catch(_exception => null);
  }

  addConnectListener = () => {
    this.hubConnection.on(SignalREvents.Connect, (data) => {
      console.log(SignalREvents.Connect, data);
    });

    this.hubConnection.on(SignalREvents.Notify, (data: SignalRNotification) => {
      this.store.dispatch(handleReceivedNotification(data));
    });
  }
}
