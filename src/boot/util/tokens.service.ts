import { EVENT_AUTH, eventBus } from '../event-bus';
import { useUserStore } from 'src/stores/user-store';
import { JwtTokensApi } from './tokens.api';

export class JwtTokensService {
  userStore = useUserStore();
  tokensAPi = new JwtTokensApi();

  constructor() {
    // this.userStore = useUserStore();
  }

  validateExpiration(iat: number, exp: number) {
    const MINIMUM_EXPIRATION_DELTA = 5; // seconds
    const now = Math.floor(Date.now() / 1000);
    if (now < iat) return false;
    const offset = now - iat;
    const remained = exp - offset;
    return offset < exp && remained > MINIMUM_EXPIRATION_DELTA;
  }

  async extractAccessToken() {
    const tokenPayload = this.userStore.$state.accessToken;
    if (!tokenPayload) return null;
    if (!this.validateExpiration(tokenPayload.iat, tokenPayload.exp)) {
      this.userStore.clearAccessToken();
      return null;
    }
    return tokenPayload.token;
  }

  async extractRefreshToken() {
    const tokenPayload = this.userStore.$state.refreshToken;
    if (!tokenPayload) return null;
    if (!this.validateExpiration(tokenPayload.iat, tokenPayload.exp)) {
      this.userStore.clearRefreshToken();
      return null;
    }
    return tokenPayload.token;
  }

  async refreshTokens() {
    const refreshToken = await this.extractRefreshToken();
    if (!refreshToken) {
      eventBus.emit(EVENT_AUTH.REFRESH_TOKEN_UNVALIDATED);
      return null;
    }

    const res = await this.tokensAPi.fetchRefresh(refreshToken);
    const axiosPromise = res.axiosPromise;
    const cancel = res.cancel;

    eventBus.on(EVENT_AUTH.LOGOUT_SUCCESS, cancel);
    return axiosPromise.then((data) => {
      eventBus.off(EVENT_AUTH.LOGOUT_SUCCESS, cancel);
      return data.data;
    });
  }

  async getAccessTokenAndRefresh() {
    const accessToken = await this.extractAccessToken();
    if (accessToken) return accessToken;
    const tokensResponse = await this.refreshTokens();
    if (!tokensResponse) return null;
    return tokensResponse.access_token.token;
  }
}
