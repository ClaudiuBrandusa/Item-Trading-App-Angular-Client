import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class ConfigService {
  app_config: Object;

  constructor(private http: HttpClient) {}
  
  load() {
    return this.http.get('./assets/application-config.json')
      .toPromise()
      .then(data => {
        this.app_config = data;
      })
      .catch(() => {
        
      });
  }
}
