import { Injectable } from '@angular/core';
import { RefreshTokenService } from './refresh-token.service';

const REFRESH_TOKEN_MILLISECONDS_BEFORE_EXPIRATION = 1500;
const DEFAULT_REFRESH_TOKEN_MILLISECONDS = 5000;

@Injectable({
  providedIn: 'root'
})
export class SilentTokenRefreshService {
  private isRunning = false;
  private interval: NodeJS.Timeout | undefined;

  constructor(private refreshTokenService: RefreshTokenService) { }

  start(milliseconds: number) {
    if (this.isRunning) return;

    const duration = milliseconds > REFRESH_TOKEN_MILLISECONDS_BEFORE_EXPIRATION ? milliseconds - REFRESH_TOKEN_MILLISECONDS_BEFORE_EXPIRATION : DEFAULT_REFRESH_TOKEN_MILLISECONDS;
    
    this.isRunning = true;

    this.interval = setInterval(async () => {
      await this.refreshTokenService.refresh();
    }, duration);
  }

  stop() {
    if (!this.isRunning) return;
    
    this.isRunning = false;

    if (this.interval) {
      clearInterval(this.interval);
      this.interval = undefined;
    }
  }
}
