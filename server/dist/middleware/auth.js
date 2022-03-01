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
import { config } from '../config.js';
import * as userRepository from '../data/auth.js';
// 미들웨어 클라이언트의 요청에 헤더를 확인 하는곳
const AUTH_ERROR = { message: 'Authentication Error' };
export const isAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //  1. Cookie 헤더에 있는지 확인(for Browser)
    //  2. Header (Non-Browser Client)
    let token;
    //  check the header first
    const authHeader = req.get('Authorization'); //auth를 받아옴
    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1]; // barear 다음부터 오는 토큰을 받아옴
    }
    // no token in the header, check the cookie
    if (!token) {
        token = req.cookies['token'];
    }
    if (!token) {
        return res.status(401).json(AUTH_ERROR);
    }
    jwt.verify(token, config.jwt.secretKey, (error, decoded) => __awaiter(void 0, void 0, void 0, function* () {
        if (error) {
            return res.status(401).json(AUTH_ERROR);
        }
        const user = yield userRepository.findById(decoded.id);
        if (!user) {
            return res.status(401).json(AUTH_ERROR);
        }
        req.userId = user.id; //토큰이 있을때만 req 에 id를 저장할 수 있음
        req.token = token;
        next();
    }));
});
//# sourceMappingURL=auth.js.map