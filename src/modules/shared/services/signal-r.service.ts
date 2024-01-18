import { Injectable, OnDestroy } from '@angular/core';
import * as signalR from "@microsoft/signalr"
import { EventBusUtils } from '../utils/event-bus.utility';
import { RefreshTokenService } from '../../identity/services/refresh-token.service';
import { SignalRNotification } from '../models/signal-r/signal-r-notification';
import { NetworkService } from './network.service';
import { SignalREndpoints } from '../models/endpoints/signal-r-endpoints.config';
import { EndpointsService } from '../../app/services/endpoints.service';
import { SignalREvents } from '../enums/signal-r-events.enum';
import { Store } from '@ngrx/store';
import { handleReceivedNotification } from '../../notification/store/notification.actions';

@Injectable({
  providedIn: 'root'
})
export class SignalRService extends NetworkService<SignalREndpoints> implements OnDestroy {

  private hubConnection: signalR.HubConnection;
  private eventBusUtility: EventBusUtils;
  private connectionStatus: Boolean;
  private endpoints: SignalREndpoints;
  
  constructor(protected endpointsService: EndpointsService, private refreshTokenService: RefreshTokenService, private store: Store) {
    super(endpointsService);
    this.endpoints = endpointsService.getSignalR();
  }

  ngOnDestroy() {
    this.eventBusUtility.clearSubscriptions();
  }

  public connect(token: string) {
    if (!!!token || !this.refreshTokenService.canRefreshTokens()) return;
    if (this.hubConnection && this.connectionStatus) return;
    this.connectionStatus = true;
    this.startConnection(token);
    this.addConnectListener();
  }

  public async disconnect() {
    if(!this.connectionStatus) {
      return;
    }
    this.connectionStatus = false;

    if (this.hubConnection) {
      await this.hubConnection.stop();
    }
  }

  startConnection = (token: string) => {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .configureLogging(signalR.LogLevel.Error)
      .withUrl(this.endpoints.hub, {
        transport: signalR.HttpTransportType.WebSockets,
        accessTokenFactory: () => token,
        skipNegotiation: true
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
