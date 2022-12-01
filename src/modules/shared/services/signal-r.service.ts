import { Injectable } from '@angular/core';
import * as signalR from "@microsoft/signalr"
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
    this.eventBusUtility.on('connected', (token) => {
      if (!!!token) return;
      if (this.hubConnection && this.connectionStatus) return;
      this.connectionStatus = true;
      this.startConnection(token);
      this.addConnectListener();
    });

    this.eventBusUtility.on('disconnected', () => {
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
        .then(() => console.log('Connection started'))
        .catch(error => console.log('Error while starting connection: ', error));
  }

  public addConnectListener = () => {
    this.hubConnection.on('connect', (data) => {
      console.log('connect ', data);
    })
  }
}
