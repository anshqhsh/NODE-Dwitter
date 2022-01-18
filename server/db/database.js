import mysql from 'mysql2';
import { config } from '../config.js';
import SQ from 'sequelize';

const { host, user, database, password } = config.db;
export const sequelize = new SQ.Sequelize(database, user, password, {
  host,
  dialect: 'mysql',
});

// mysql에 연결
const pool = mysql.createPool({
  host,
  user,
  database,
  password,
});

// 프로미스로 출력
export const db = pool.promise();
