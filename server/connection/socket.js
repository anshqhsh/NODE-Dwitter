import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { config } from '../config.js';

//외부에서 사용 불가
class Socket {
  //소켓 생성자
  constructor(server) {
    this.io = new Server(server, {
      cors: {
        origin: '*',
      },
    });
    //소켓 검증
    this.io.use((socket, next) => {
      const token = socket.handshake.auth.token;
      //로그인한 사람에게만 트윗을 보여주고싶음
      if (!token) {
        return next(new Error('Authentication error'));
      }
      jwt.verify(token, config.jwt.secretKey, (error, decoded) => {
        if (error) {
          return next(new Error('Authentication error'));
        }
        next();
      });
    });
    // client와 연결 확인
    this.io.on('connection', socket => {
      console.log('Socket client connected');
    });
  }
}

let socket;
// 내부 클래스를 통해 한번만 클래스 생성함 (싱글톤을 구현 생성자를 내부 클래스에서 한번만 사용 모듈을 이용(18.4))
export function initSocket(server) {
  if (!socket) {
    socket = new Socket(server);
  }
}
//소켓 클래스 io를 전달
export function getSocketIO() {
  if (!socket) {
    throw new Error('Please call init first');
  }
  return socket.io;
}
