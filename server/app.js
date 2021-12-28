import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import 'express-async-errors';
import helmet from 'helmet';
import tweetsRouter from './router/tweets.js';

const app = express();
// 미들웨어 : 거처가는 함수들 next를 통해 다음 미들웨어로 요청을 넘김
app.use(express.json());
// HTTP 헤더의 설정변경을 통해 위함한 웹취약점으로부터 서버를 보호
app.use(helmet());
// 다양한 옵션들을 이용하여 Cross-origin resource sharing (CORS)를 활성화합니다.
app.use(cors());
//	HTTP 요청 로그를 남깁니다
app.use(morgan('tiny'));

app.use('/tweets', tweetsRouter);

app.use((req, res, next) => {
  res.sendStatus(404); // 지원하지 않는 API
});

// 에러처리
app.use((error, req, res, next) => {
  console.error(error);
  res.sendStatus(500);
});

app.listen(8080);
