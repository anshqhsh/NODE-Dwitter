import axios from 'axios';
import axiosRetry from 'axios-retry';

const defaultRetryConfig = {
  retries: 5,
  initialDelayMs: 100,
};
export default class HttpClient {
  constructor(
    baseURL,
    authErrorEventBus,
    getCsrfToken,
    config = defaultRetryConfig
  ) {
    this.authErrorEventBus = authErrorEventBus;
    this.getCsrfToken = getCsrfToken;
    this.client = axios.create({
      baseURL: baseURL,
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    });
    // 재시도
    axiosRetry(this.client, {
      retries: config.retries,
      retryDelay: retry => {
        const delay = Math.pow(2, retry) * config.initialDelayMs; // 2의 제곱 만큼 기다렸다 재시도 100,200,400,800, 1600
        const jitter = delay * 0.1 * Math.random(); // jittering //10, 20, 40, 80, 160
        return delay + jitter;
      },
      // 어떤상황에 retry를 할 껀지
      // IdempotentRequest : 요청을 해도 서버가 변하지 않는 상태(etc. get)
      retryCondition: err =>
        axiosRetry.isNetworkOrIdempotentRequestError(err) ||
        err.response.status === 429,
    });
  }

  async fetch(url, options) {
    const { body, method, headers } = options;
    const req = {
      url,
      method,
      headers: {
        ...headers,
        '_csrf-token': this.getCsrfToken(), // 헤더에 추가
      },
      data: body,
    };

    try {
      const res = await this.client(req);
      return res.data;
    } catch (err) {
      if (err.response) {
        const data = err.response.data;
        const message =
          data && data.message ? data.message : 'Something went wrong! 🤪';
        throw new Error(message);
      }
      throw new Error('connetion error');
    }
  }
}
