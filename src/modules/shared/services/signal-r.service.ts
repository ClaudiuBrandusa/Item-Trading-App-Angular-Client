import { Injectable } from '@angular/core';
import * as signalR from "@microsoft/signalr"
import { SignalR } from '../enums/signal-r.enum';
import { EventBusUtils } from '../utils/event-bus.utility';
import { EventBusService } from './event-bus.service';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {

  private hubConnection: signalR.HubConnection;
  private eventBusUtility: EventBusUtils;
  private connectionStatus: Boolean;
  
  constructor(eventBus: EventBusService) {
    this.eventBusUtility = new EventBusUtils(eventBus);
    this.eventBusUtility.on(SignalR.Connected, (token) => {
      if (!!!token) return;
      if (this.hubConnection && this.connectionStatus) return;
      this.connectionStatus = true;
      this.startConnection(token);
      this.addConnectListener();
    });

    this.eventBusUtility.on(SignalR.Disconnected, () => {
      this.connectionStatus = false;
      this.hubConnection.stop();
    });
  }

  public startConnection = (token: string) => {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5000/hubs/notification', {
        transport: signalR.HttpTransportType.LongPolling,
        headers: {
          'Authorization': `bearer ${token}`
        }
      })
      .build();
      
      this.hubConnection
        .start()
        .catch(error => console.log('Error while starting connection: ', error));
  }

  public addConnectListener = () => {
    this.hubConnection.on('connect', (data) => {
      console.log('connect ', data);
    })
  }
}
