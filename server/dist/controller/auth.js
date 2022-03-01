var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import * as userRepository from '../data/auth.js';
import { config } from '../config.js';
// 사용자 데이터를 저장, 읽기 Repository를 이용해서 정보를 찾을 것
export function signup(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { username, password, name, email, url } = req.body;
        const found = yield userRepository.findByUsername(username);
        // 같은 이름이 있을때
        if (found) {
            return res.status(409).json({ message: `${username} already exists` });
        }
        //암호화
        const hashed = yield bcrypt.hash(password, config.bcrypt.saltRounds);
        // 사용자 아이디를 받아
        const userId = yield userRepository.createUser({
            username,
            password: hashed,
            name,
            email,
            url,
        });
        // 토큰을 생성
        const token = createJwtToken(userId); // cookie header는 브라우저에 특화된곳
        setToken(res, token);
        res.status(201).json({ token, username });
    });
}
export function login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { username, password } = req.body;
        const user = yield userRepository.findByUsername(username);
        if (!user) {
            return res.status(401).json({ message: 'Invalid user or password' });
        }
        const isValidPassword = yield bcrypt.compare(password, user.password); // 해쉬 패스워드와 입력 패스워드 비교
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid user or password' });
        }
        //성공한다면 토큰을 생성 하고 이름을 받아옴
        const token = createJwtToken(user.id);
        setToken(res, token);
        res.status(200).json({ token, username });
    });
}
export function logout(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        res.cookie('token', '');
        res.status(200).json({ message: 'User has been logged out' });
    });
}
function createJwtToken(id) {
    return jwt.sign({ id }, config.jwt.secretKey, {
        expiresIn: config.jwt.expiresInSec,
    });
}
function setToken(res, token) {
    const options = {
        maxAge: config.jwt.expiresInSec * 1000,
        httpOnly: true,
        sameSite: 'none',
        secure: true,
    };
    res.cookie('token', token, options); //헤더 쿠키에 저장, Http-Only
}
export function me(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield userRepository.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ token: req.token, username: user.username });
    });
}
export function csrfToken(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const csrfToken = yield generateCSRFToken();
        res.status(200).json({ csrfToken });
    });
}
function generateCSRFToken() {
    return __awaiter(this, void 0, void 0, function* () {
        return bcrypt.hash(config.csrf.plainToken, 1);
    });
}
//# sourceMappingURL=auth.js.map