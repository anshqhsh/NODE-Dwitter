var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import SQ from 'sequelize';
import { sequelize } from '../db/database.js';
const DataTypes = SQ.DataTypes;
// 단수로 지정해도 자동으로 users라는 복수 테이블 명으로 지정됨
export const User = sequelize.define('user', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    username: {
        type: DataTypes.STRING(45),
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING(128),
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING(45),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(128),
        allowNull: false,
    },
    url: DataTypes.TEXT,
}, { timestamps: false });
export function findByUsername(username) {
    return __awaiter(this, void 0, void 0, function* () {
        return User.findOne({ where: { username } });
    });
}
export function findById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return User.findByPk(id);
    });
}
export function createUser(user) {
    return __awaiter(this, void 0, void 0, function* () {
        return User.create(user).then(data => data.dataValues.id);
    });
}
//# sourceMappingURL=auth.js.map