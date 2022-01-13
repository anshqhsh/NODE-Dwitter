import { db } from '../db/database.js';

const SELECT_JOIN =
  'SELECT tw.id, tw.text, tw.createdAt, tw.userId, us.username, us.name, us.url FROM tweets as tw JOIN users as us ON tw.userId=us.id ';
const ORDER_DESC = 'ORDER BY tw.createdAt DESC';
//userRepository에서 데이터를 가져옴
export async function getAll() {
  return db
    .execute(`${SELECT_JOIN} ${ORDER_DESC}`) //
    .then(result => result[0]); // 동일한 사용자일 때
}

export async function getAllByUsername(username) {
  return db
    .execute(`${SELECT_JOIN} WHERE username=? ${ORDER_DESC}`, [username]) //
    .then(result => result[0]); // 동일한 사용자일 때
}

export async function getById(id) {
  return db
    .execute(`${SELECT_JOIN} WHERE tw.id=?`, [id]) //
    .then(result => result[0][0]); // 동일한 사용자일 때
}

//트윗을 만들고 getById를 리턴
export async function create(text, userId) {
  return db
    .execute('INSERT INTO tweets (text, createdAt, userId) VALUES(?,?,?)', [
      text,
      new Date(),
      userId,
    ])
    .then(result => getById(result[0].insertId));
}

export async function update(id, text) {
  return db
    .execute('UPDATE tweets SET text=? WHERE id=?', [text, id])
    .then(() => getById(id));
}

export async function remove(id) {
  return db.execute('DELETE FROM tweets WHERE id=?', [id]);
  tweets = tweets.filter(tweet => tweet.id !== id);
}
