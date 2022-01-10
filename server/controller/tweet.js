import { getSocketIO } from '../connection/socket.js';
import * as tweetRepository from '../data/tweet.js';

export async function getTweets(req, res) {
  const username = req.query.username;
  const data = await (username
    ? tweetRepository.getAllByUsername(username)
    : tweetRepository.getAll()); //유저 네임이 없다면 전체 트윗
  res.status(200).json(data);
}

export async function getTweet(req, res, next) {
  const id = req.params.id;
  const tweet = await tweetRepository.getById(id);
  if (tweet) {
    res.status(200).json(tweet);
  } else {
    res.status(404).json({ message: `Tweet id(${id}) not found` });
  }
}

export async function createTweet(req, res, next) {
  const { text, username, name } = req.body;
  const tweet = await tweetRepository.create(text, req.userId);
  res.status(201).json(tweet);
  // 소켓 통신 부분
  getSocketIO().emit('tweets', tweet);
}
export async function updateTweet(req, res, next) {
  const id = req.params.id;
  const text = req.body.text;
  // 업데이트전 해당 아이디의 트윗을 가져와서 없을때랑 id가 다를때 해당 res를 보내주고 아닐때는 업데이트를 해준다.
  const tweet = await tweetRepository.getById(id);
  if (!tweet) {
    return res.sendStatus(404);
  }
  if (tweet.userId != req.userId) {
    return res.sendStatus(403);
  }

  const updated = await tweetRepository.update(id, text);

  res.status(200).json(updated);
}

export async function deleteTweet(req, res, next) {
  const id = req.params.id;
  const tweet = await tweetRepository.getById(id);
  if (!tweet) {
    return res.sendStatus(404);
  }
  if (tweet.userId != req.userId) {
    return res.sendStatus(403);
  }
  await tweetRepository.remove(id);

  res.sendStatus(204);
}
