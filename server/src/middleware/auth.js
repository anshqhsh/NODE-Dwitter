import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import * as userRepository from '../data/auth.js';

// 미들웨어 클라이언트의 요청에 헤더를 확인 하는곳
const AUTH_ERROR = { message: 'Authentication Error' };

export const isAuth = async (req, res, next) => {
  //  1. Cookie 헤더에 있는지 확인(for Browser)
  //  2. Header (Non-Browser Client)

  let token;
  //  check the header first

  const authHeader = req.get('Authorization'); //auth를 받아옴
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1]; // barear 다음부터 오는 토큰을 받아옴
  }

  // no token in the header, check the cookie
  if (!token) {
    token = req.cookies['token'];
  }
  if (!token) {
    return res.status(401).json(AUTH_ERROR);
  }

  jwt.verify(token, config.jwt.secretKey, async (error, decoded) => {
    if (error) {
      return res.status(401).json(AUTH_ERROR);
    }
    const user = await userRepository.findById(decoded.id);
    if (!user) {
      return res.status(401).json(AUTH_ERROR);
    }

    req.userId = user.id; //토큰이 있을때만 req 에 id를 저장할 수 있음
    req.token = token;
    next();
  });
};
