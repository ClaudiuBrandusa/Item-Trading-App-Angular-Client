import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigFileState } from '../enums/config-file-state';
import { Interval } from '../utils/async-utils';

@Injectable()
export class ConfigService {
  private app_config: Object;
  private state: ConfigFileState = ConfigFileState.Sleeping;

  constructor(private http: HttpClient) {}
  
  load() {
    this.state = ConfigFileState.Loading;
    this.http.get('./assets/application-config.json')
      .subscribe(response => {
          this.app_config = response;
          this.state = ConfigFileState.Loaded;
        });

    return new Promise<void>((resolve) => resolve());
  }

  async loadOptions<T>(objectName: string) {
    if(objectName == null)
      return null;

    if(this.IsSleeping()) {
      await this.load();
    } 

    if(this.IsLoading()) {
      await Interval(() => this.IsLoading(), 100, 5000);
    }
      
    if(this.AppConfig) {
      return <T>this.GetObjectFromPath(objectName);
    }

    return null;
  }

  get AppConfig(): any {
    return (<any>this.app_config)
  }

  // service state

  IsSleeping() {
    return this.state == ConfigFileState.Sleeping;
  }

  IsLoading() {
    return this.state == ConfigFileState.Loading;
  }

  IsLoaded() {
    return this.state == ConfigFileState.Loaded;
  }

  private SplitObjectName(objectName: string) {
    return objectName.split(":");
  }

  private GetObjectFromPath(objectName: string) {
    let path = this.SplitObjectName(objectName);
    let tmp = this.AppConfig;
    path.forEach((element) => {
      if(tmp.hasOwnProperty(element)) {
        tmp = tmp[element];
      }
    });

    return tmp;
  }
}
