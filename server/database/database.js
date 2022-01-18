import Mongoose from 'mongoose';
import { config } from '../config.js';

//  5.0부터 인자를 전달하지 않아도 됨
export async function connectDB(schema) {
  return Mongoose.connect(config.db.host);
}
export function userVirtualId(schema) {
  //몽고디비에선 이렇게 저장 _id => id 코드상에 읽도록
  schema.virtual('id').get(function () {
    return this._id.toString();
  });
  schema.set('toJSON', { virtuals: true }); // 설정 하지 않으면 코드에서 접근은 가능하나 json에 포함이 되지 않음
  schema.set('toObject', { virtuals: true }); //오브젝트에서 사용
}

//TODO: Delete blow
let db;

// // 유저에 대한 컬렉션을 전달
// export function getUsers() {
//   return db.collection('users');
// }

//트윗 전달
export function getTweets() {
  return db.collection('tweets');
}
