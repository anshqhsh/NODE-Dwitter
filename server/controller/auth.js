import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import {} from 'express-async-errors';

import * as userRepository from '../data/auth.js';

// 사용자 데이터를 저장, 읽기 Repository를 이용해서 정보를 찾을 것

// Secret
const jwtSecretkey = 'C!E4SMLxdnefVUO5m8FsedvxlSxAJt#o';
const jwtExpiresInDays = '2d';
const bcryptSaltRounds = 12;

export async function signup(req, res) {
  const { username, password, name, email, url } = req.body;
  const found = await userRepository.findByUsername(username);
  // 같은 이름이 있을때
  if (found) {
    return res.status(409).json({ message: `${username} already exists` });
  }
  //암호화
  const hashed = await bcrypt.hash(password, bcryptSaltRounds);
  // 사용자 아이디를 받아
  const userId = await userRepository.createUser({
    username,
    password: hashed,
    name,
    email,
    url,
  });
  // 토큰을 생성
  const token = createJwtToken(userId);
  res.status(201).json({ token, username });
}

export async function login(req, res) {
  const { username, password } = req.body;
  const user = await userRepository.findByUsername(username);
  if (!user) {
    return res.status(401).json({ message: 'Invalid user or password' });
  }
  const token = createJwtToken(user.id);
  res.status(200).json({ token, username });
}

function createJwtToken(id) {
  return jwt.sign({ id }, jwtSecretkey, { expiresIn: jwtExpiresInDays });
}
