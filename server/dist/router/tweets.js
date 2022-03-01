import express from 'express';
import 'express-async-errors';
import { body } from 'express-validator';
import * as tweetController from '../controller/tweet.js';
import { isAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validator.js';
const router = express.Router();
// validation - 유효성 검사
// sanitization
// 참고
// Contract Testing: Client-Server
// Proto-base?
const validateTweet = [
    body('text')
        .trim()
        .isLength({ min: 3 })
        .withMessage('text should be at least 3 characters'),
    validate,
];
// GET /tweets
// GET /tweets?username=:username
//  isAuth, 미들웨어를 연결해줌 로그인한 사람만 가능하도록
router.get('/', isAuth, tweetController.getTweets); //값이 아닌 함수를 연결
// GET /tweets/:id
router.get('/:id', isAuth, tweetController.getTweet);
// POST /tweets
router.post('/', isAuth, validateTweet, tweetController.createTweet);
// PUT /tweets/:id
router.put('/:id', isAuth, validateTweet, tweetController.updateTweet);
// DELETE /tweets/:id
router.delete('/:id', isAuth, tweetController.deleteTweet);
export default router;
//# sourceMappingURL=tweets.js.map