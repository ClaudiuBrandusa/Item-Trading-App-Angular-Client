import { Injectable } from '@angular/core';
import * as signalR from "@microsoft/signalr"
import { SignalR } from '../enums/signal-r.enum';
import { EventBusUtils } from '../utils/event-bus.utility';
import { EventBusService } from './event-bus.service';
import { CustomHttpClient } from '../utils/custom-http-client';
import { RefreshTokenService } from '../../identity/services/refresh-token.service';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {

  private hubConnection: signalR.HubConnection;
  private eventBusUtility: EventBusUtils;
  private connectionStatus: Boolean;
  private httpClient: CustomHttpClient;
  
  constructor(eventBus: EventBusService, private refreshTokenService: RefreshTokenService) {
    this.httpClient = new CustomHttpClient(refreshTokenService);
    this.eventBusUtility = new EventBusUtils(eventBus);
    this.eventBusUtility.on(SignalR.Connected, (token) => {
      this.connect(token);
    });

    this.eventBusUtility.on(SignalR.Disconnected, (token) => {
      this.connectionStatus = false;
      this.httpClient.setToken(token);
      if (this.hubConnection) this.hubConnection.stop();
    });
  }

  public connect(token: string) {
    if (!!!token) return;
    if (this.hubConnection && this.connectionStatus) return;
    this.connectionStatus = true;
    this.startConnection(token);
    this.addConnectListener();
  }

  startConnection = (token: string) => {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5000/hubs/notification', {
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
    this.hubConnection.on('connect', (data) => {
      console.log('connect ', data);
    })
  }
}
