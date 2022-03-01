var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getSocketIO } from '../socket.js';
import * as tweetRepository from '../data/tweet.js';
export function getTweets(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const username = req.query.username;
        const data = yield (username
            ? tweetRepository.getAllByUsername(username)
            : tweetRepository.getAll()); //유저 네임이 없다면 전체 트윗
        res.status(200).json(data);
    });
}
export function getTweet(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.params.id;
        const tweet = yield tweetRepository.getById(id);
        if (tweet) {
            res.status(200).json(tweet);
        }
        else {
            res.status(404).json({ message: `Tweet id(${id}) not found` });
        }
    });
}
export function createTweet(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { text } = req.body;
        const tweet = yield tweetRepository.create(text, req.userId);
        res.status(201).json(tweet);
        // 소켓 통신 부분
        getSocketIO().emit('tweets', tweet);
    });
}
export function updateTweet(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.params.id;
        const text = req.body.text;
        // 업데이트전 해당 아이디의 트윗을 가져와서 없을때랑 id가 다를때 해당 res를 보내주고 아닐때는 업데이트를 해준다.
        const tweet = yield tweetRepository.getById(id);
        if (!tweet) {
            return res.sendStatus(404);
        }
        if (tweet.userId != req.userId) {
            return res.sendStatus(403);
        }
        const updated = yield tweetRepository.update(id, text);
        res.status(200).json(updated);
    });
}
export function deleteTweet(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.params.id;
        const tweet = yield tweetRepository.getById(id);
        if (!tweet) {
            return res.sendStatus(404).json({ message: `Tweet not found:${id}` });
        }
        if (tweet.userId != req.userId) {
            return res.sendStatus(403);
        }
        yield tweetRepository.remove(id);
        res.sendStatus(204);
    });
}
//# sourceMappingURL=tweet.js.map