import { DefaultHttpClient, HttpError, HttpRequest, HttpResponse } from "@microsoft/signalr";
import { RefreshTokenService } from "../../identity/services/refresh-token.service";

export class CustomHttpClient extends DefaultHttpClient {
  private currentToken: string = "";

  constructor(private refreshTokenService: RefreshTokenService) {
    super(console);
  }

  public async send(
    request: HttpRequest
  ): Promise<HttpResponse> {
    const authHeaders = this.getAuthHeaders(this.currentToken);
    request.headers = { ...request.headers, ...authHeaders };

    try {
      const response = await super.send(request);
      return response;
    } catch (er) {
      if (er instanceof HttpError) {
        const error = er as HttpError;
        if (error.statusCode == 401) {
          await this.refreshTokenService.refresh();
          const authHeaders = this.getAuthHeaders();
          request.headers = { ...request.headers, ...authHeaders };
        }
      } else {
        throw er;
      }
    }
    //re try the request
    return super.send(request);
  }

  setToken(newToken: string) {
    this.currentToken = newToken;
  }

  private getAuthHeaders(token: string = "") {
    if (token === "") token = this.refreshTokenService.getToken()
    return {
      Authorization: `Bearer ${token}`,
    };
  }
}