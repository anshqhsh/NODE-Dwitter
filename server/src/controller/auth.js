import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import {} from 'express-async-errors';
import * as userRepository from '../data/auth.js';
import { config } from '../config.js';

// 사용자 데이터를 저장, 읽기 Repository를 이용해서 정보를 찾을 것

export async function signup(req, res) {
  const { username, password, name, email, url } = req.body;
  const found = await userRepository.findByUsername(username);
  // 같은 이름이 있을때
  if (found) {
    return res.status(409).json({ message: `${username} already exists` });
  }
  //암호화
  const hashed = await bcrypt.hash(password, config.bcrypt.saltRounds);
  // 사용자 아이디를 받아
  const userId = await userRepository.createUser({
    username,
    password: hashed,
    name,
    email,
    url,
  });
  // 토큰을 생성
  const token = createJwtToken(userId); // cookie header는 브라우저에 특화된곳
  setToken(res, token);
  res.status(201).json({ token, username });
}

export async function login(req, res) {
  const { username, password } = req.body;
  const user = await userRepository.findByUsername(username);
  if (!user) {
    return res.status(401).json({ message: 'Invalid user or password' });
  }
  const isValidPassword = await bcrypt.compare(password, user.password); // 해쉬 패스워드와 입력 패스워드 비교

  if (!isValidPassword) {
    return res.status(401).json({ message: 'Invalid user or password' });
  }

  //성공한다면 토큰을 생성 하고 이름을 받아옴
  const token = createJwtToken(user.id);
  setToken(res, token);
  res.status(200).json({ token, username });
}
export async function logout(req, res, next) {
  res.cookie('token', '');
  res.status(200).json({ message: 'User has been logged out' });
}
function createJwtToken(id) {
  return jwt.sign({ id }, config.jwt.secretKey, {
    expiresIn: config.jwt.expiresInSec,
  });
}
function setToken(res, token) {
  const options = {
    maxAge: config.jwt.expiresInSec * 1000,
    httpOnly: true,
    sameSite: 'none', // 서버, 클라이언트가 동일한 도메인이 아니더라도 작동
    secure: true,
  };
  res.cookie('token', token, options); //헤더 쿠키에 저장, Http-Only
}

export async function me(req, res, next) {
  const user = await userRepository.findById(req.userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.status(200).json({ token: req.token, username: user.username });
}
export async function csrfToken(req, res, next) {
  const csrfToken = await generateCSRFToken();
  res.status(200).json({ csrfToken });
}

async function generateCSRFToken() {
  return bcrypt.hash(config.csrf.plainToken, 1);
}
