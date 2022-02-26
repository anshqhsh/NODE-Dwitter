import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import tweetsRouter from './router/tweets.js';
import authRouter from './router/auth.js';
import { config } from './config.js';
import { initSocket } from './connection/socket.js';
import { sequelize } from './db/database.js';

const app = express();

const corsOption = {
  origin: config.cors.allowedOrigin,
  optionSuccessStatus: 200,
  credentials: true, // allow The Access-Control-Allow-Credentials(헤더에 포함) 서버에서 리스폰스 반응을 보낼때 이것을 추가 해야 서버에서 받은 바디를 js로 보내준다
};

// 미들웨어 : 거처가는 함수들 next를 통해 다음 미들웨어로 요청을 넘김
app.use(express.json());
// httponly를 위한 설정
app.use(cookieParser());
// HTTP 헤더의 설정변경을 통해 위함한 웹취약점으로부터 서버를 보호
app.use(helmet());
// 다양한 옵션들을 이용하여 Cross-origin resource sharing (CORS)를 활성화합니다.
app.use(cors(corsOption));
//	HTTP 요청 로그를 남깁니다
app.use(morgan('tiny'));

app.use('/tweets', tweetsRouter);
app.use('/auth', authRouter);

app.use((req, res, next) => {
  res.sendStatus(404); // 지원하지 않는 API
});

// 에러처리
app.use((error, req, res, next) => {
  console.error(error);
  res.sendStatus(500);
});

sequelize.sync().then(() => {
  console.log(`Server is started... ${new Date()}`);
  const server = app.listen(config.port);
  initSocket(server);
});
