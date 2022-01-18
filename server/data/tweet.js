import Mongoose from 'mongoose';
import { userVirtualId } from '../database/database.js';
import * as userRepository from './auth.js';

// NOSQL(특정한 컬렉션에서 관계가 불가피하게 필요할때는 정보의 중복성이 선호됨)
// 관계형으로 짜는 것 보단 같은 데이터를 중복으로 가지고 있는것이 더 나음
// 모든 사용자가 트윗을 쿼리하는 횟수 > 사용자가 사용자의 정보를 업데이트 횟수
// 사용자의 고유 ID는 변경이 안되기 때문에 이름 변경은 놔두게 된다.
// 프로필 DB
// 사용자의 문서 DB:서버1, 서버2, 서버3
// 관계형 조인쿼리의 성능이 좋지 않다.

// SQL: 관계형
// 조인쿼리의 성능이 좋기 때문에

const tweetSchema = new Mongoose.Schema(
  {
    text: { type: String, required: true },
    userId: { type: String, required: true },
    name: { type: String, required: true },
    username: { type: String, required: true },
    url: String,
  },
  { timestamps: true } // 자동으로 생성, 변경 체크
);

userVirtualId(tweetSchema);
// model
const Tweet = Mongoose.model('Tweet', tweetSchema);

export async function getAll() {
  return Tweet.find().sort({ createdAt: -1 });
}

export async function getAllByUsername(username) {
  return Tweet.find({ username }).sort({ createdAt: -1 });
}

export async function getById(id) {
  return Tweet.findById(id);
}

//트윗을 만들고 getById를 리턴
export async function create(text, userId) {
  return userRepository.findById(userId).then(user =>
    new Tweet({
      text,
      userId,
      name: user.name,
      username: user.username,
    }).save()
  );
}

export async function update(id, text) {
  return Tweet.findByIdAndUpdate(id, { text }, { returnOriginal: false });
}

export async function remove(id) {
  return Tweet.findByIdAndDelete(id);
}
