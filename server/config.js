import dotenv from 'dotenv';
dotenv.config();

//env파일에서 그때import { config } from '../config.js';그때 받아오는 것보단 불러와서 재사용성을 높히기 위함

// 해당키가 잘 불러져 오는지 확인 하는 펑션
function required(key, defaultValue = undefined) {
  const value = process.env[key] || defaultValue; // 동적으로 값을 확ㅣ하고 값이 없다면 defaultValue값으로 덮어줌
  // null, undefined = true
  if (value == null) {
    throw new Error(`key ${key} is undefined`);
  }
  return value;
}

// 각 키를 그룹별로 정의
export const config = {
  jwt: {
    secretKey: required('JWT_SECRET'),
    expiresInSec: parseInt(required('JWT_EXPIRES_SEC', 86400)),
  },
  bcrypt: {
    saltRounds: parseInt(required('BCRYPT_SALT_ROUND', 12)),
  },
  db: {
    host: required('DB_HOST'),
    user: required('DB_USER'),
    database: required('DB_DATABASE'),
    password: required('DB_PASSWORD'),
  },
  port: parseInt(required('PORT', 8080)),
  cors: {
    allowedOrigin: required('CORS_ALLOW_ORIGIN'),
  },
  csrf: {
    plainToken: required('CSRF_SECRET_KEY'),
  },
  rateLimit: {
    windowMs: 60000,
    maxRequest: 100,
  },
};
