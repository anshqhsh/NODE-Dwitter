import mysql from 'mysql2';
import { config } from '../config.js';

// mysql에 연결
const pool = mysql.createPool({
  host: config.db.host,
  user: config.db.user,
  database: config.db.database,
  password: config.db.password,
});

// 프로미스로 출력
export const db = pool.promise();
