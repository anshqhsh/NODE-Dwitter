import MongoDb from 'mongodb';
import { config } from '../config.js';

let db;

export async function connectDB() {
  return MongoDb.MongoClient.connect(config.db.host) //
    .then(client => {
      db = client.db();
    });
}

// 유저에 대한 컬렉션을 전달
export function getUsers() {
  return db.collection('users');
}

//트윗 전달
export function getTweets() {
  return db.collection('tweets');
}
