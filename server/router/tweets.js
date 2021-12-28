import express, { json } from 'express';
import 'express-async-errors';

let tweets = [
  {
    id: '1',
    text: '화이팅',
    createdAt: Date.now.toString(),
    name: 'Joonhyuk',
    username: 'joonhyuk',
    url: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',
  },
  {
    id: '2',
    text: 'HI',
    createdAt: Date.now().toString(),
    name: 'Joon',
    username: 'joon',
    url: 'https://anshqhsh.github.io/portfolio/images/profile%20r.JPG',
  },
  {
    id: '3',
    text: '안녕?',
    createdAt: Date.now().toString(),
    name: 'sori',
    username: 'sori',
    url: 'https://anshqhsh.github.io/portfolio/images/profile%20r.JPG',
  },
];
const router = express.Router();

// GET /tweets
// GET /tweets?username=:username
router.get('/', (req, res, next) => {
  const username = req.query.username;
  const data = username //
    ? tweets.filter(tweet => tweet.name === username)
    : tweets; //유저 네임이 없다면 전체 트윗
  res.status(200).json(data);
});
// GET /tweets/:id
router.get('/:id', (req, res, next) => {
  const id = req.params.id;
  const tweet = tweets.find(tweet => tweet.id === id);
  if (tweet) {
    res.status(200).json(tweet);
  } else {
    res.status(404).json({ message: `Tweet id(${id}) not found` });
  }
});
// POST /tweets
router.post('/', (req, res, next) => {
  const { text, username, name } = req.body;
  const tweet = {
    id: Date.now().toString(),
    text,
    createdAt: new Date(),
    name,
    username,
  };
  tweets = [tweet, ...tweets];
  res.status(201).json(tweet);
});
// PUT /tweets/:id
router.put('/:id', (req, res, next) => {
  const id = req.params.id;
  const text = req.body.text;
  const tweet = tweets.find(tweet => tweet.id === id);
  if (tweet) {
    tweet.text = text;
    res.status(200).json(tweet);
  } else {
    res.status(404).json({ message: `Tweet id(${id}) not found` });
  }
});

// DELETE /tweet/:id
router.delete('/:id', (req, res, next) => {
  const id = req.params.id;
  tweets = tweets.filter(tweet => tweet.id !== id);
  res.sendStatus(204);
});

export default router;
