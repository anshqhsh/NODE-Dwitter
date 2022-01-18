import Mongoose from 'mongoose';
import { userVirtualId } from '../database/database.js';

const userSchema = new Mongoose.Schema({
  username: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  url: String,
});

userVirtualId(userSchema);

// model 데이터를 읽어옴
const User = Mongoose.model('User', userSchema); //유저 컬렉션을 스키마와 연결

export async function findByUsername(username) {
  return User.findOne({ username });
}

export async function findById(id) {
  return User.findById(id);
}

export async function createUser(user) {
  //model 이용
  return new User(user).save().then(data => data.id);
}
