import express, { json } from 'express';
import 'express-async-errors';
import * as tweetController from '../controller/tweet.js';
const router = express.Router();

// GET /tweets
// GET /tweets?username=:username
router.get('/', tweetController.getTweets); //값이 아닌 함수를 연결
// GET /tweets/:id
router.get('/:id', tweetController.getTweet);
// POST /tweets
router.post('/', tweetController.createTweet);
// PUT /tweets/:id
router.put('/:id', tweetController.updateTweet);

// DELETE /tweet/:id
router.delete('/:id', tweetController.deleteTweet);

export default router;
