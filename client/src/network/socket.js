import socket from 'socket.io-client';

export default class Socket {
  constructor(baseURL, getAccessToken) {
    // 토큰을 생성
    this.io = socket(baseURL, {
      auth: cb => cb({ token: getAccessToken() }), // 토큰전달
    });
    this.io.on('connect_error', err => {
      console.log('socket error', err.message);
    });
  }
  // 연결이 안됬을때 재연결
  onSync(event, callback) {
    if (!this.io.connected) {
      this.io.connect();
    }
    this.io.on(event, message => callback(message));
    return () => this.io.off(event); // 더이상 듣고 싶지않을때 이 콜백을 부르면 된다.
  }
}
