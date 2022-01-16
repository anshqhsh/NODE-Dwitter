import MongoDb from 'mongodb';
import { getTweets } from '../database/database.js';
import * as userRepository from './auth.js';

const ObjectId = MongoDb.ObjectId;

// NOSQL(특정한 컬렉션에서 관계가 불가피하게 필요할때는 정보의 중복성이 선호됨)
// 관계형으로 짜는 것 보단 같은 데이터를 중복으로 가지고 있는것이 더 나음
// 모든 사용자가 트윗을 쿼리하는 횟수 > 사용자가 사용자의 정보를 업데이트 횟수
// 사용자의 고유 ID는 변경이 안되기 때문에 이름 변경은 놔두게 된다.
// 프로필 DB
// 사용자의 문서 DB:서버1, 서버2, 서버3
// 관계형 조인쿼리의 성능이 좋지 않다.

// SQL: 관계형
// 조인쿼리의 성능이 좋기 때문에

//userRepository에서 데이터를 가져옴
export async function getAll() {
  return getTweets() //
    .find()
    .sort({ createdAt: -1 }) //desc
    .toArray()
    .then(mapTweets);
}

export async function getAllByUsername(username) {
  return getTweets() //
    .find({ username })
    .sort({ createdAt: -1 }) //desc
    .toArray()
    .then(mapTweets);
}

export async function getById(id) {
  return getTweets() //
    .findOne({ _id: new ObjectId(id) })
    .then(mapOptionalTweet);
}

//트윗을 만들고 getById를 리턴
export async function create(text, userId) {
  const { name, username, url } = await userRepository.findById(userId);
  const tweet = {
    text,
    createdAt: new Date(),
    userId,
    name: name,
    username: username,
    url: url,
  };
  return getTweets()
    .insertOne(tweet)
    .then(
      data => mapOptionalTweet({ ...tweet, _id: data.insertedId }) // 아이디를 넣어줌
    );
}

export async function update(id, text) {
  return getTweets()
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { text } },
      { returnDocument: 'after' }
    )
    .then(result => result.value)
    .then(mapOptionalTweet);
}

export async function remove(id) {
  return getTweets().deleteOne({ _id: new ObjectId(id) });
}

// null 일 수 도 있는 오브젝트를 변환 id를 포함해서 리턴해준다.
function mapOptionalTweet(tweet) {
  return tweet ? { ...tweet, id: tweet._id.toString() } : tweet;
}

// 각 트윗들을 받아서 mapOptionalTweet에 연결-  트윗 배열을 받아서 변환
function mapTweets(tweets) {
  return tweets.map(tweet => mapOptionalTweet(tweet)); // 생략가능
}
