import { getUsers } from '../database/database.js';
import MongoDb from 'mongodb';

const ObjectId = MongoDb.ObjectId; // class new

export async function findByUsername(username) {
  return getUsers()
    .findOne({ username }) //
    .then(mapOptionalUser);
}

export async function findById(id) {
  return getUsers()
    .findOne({ _id: new ObjectId(id) })
    .then(mapOptionalUser);
}

export async function createUser(user) {
  return getUsers()
    .insertOne(user) //사용자 오브젝트 전달
    .then(data => data.insertedId.toString());
}

function mapOptionalUser(user) {
  return user ? { ...user, id: user._id.toString() } : user; // 아이디가 오브젝트로 전달되기 때문에 id를 생성 toString
}
