var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
class UserRepository {
    getUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let where = { id: userId };
                let user = yield prisma.user.findFirst({ where });
                return user;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getUsers(usersIds) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let where = { id: { in: usersIds } };
                let users = yield prisma.user.findMany({ where });
                return users;
            }
            catch (error) {
                throw error;
            }
        });
    }
    createUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isUserCreateInput(user)) {
                try {
                    let data = user;
                    let createdUser = yield prisma.user.create({ data });
                    return createdUser;
                }
                catch (error) {
                    throw error;
                }
            }
            throw new Error("Missing argument to create a user");
        });
    }
    updateUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(user === null || user === void 0 ? void 0 : user.id)) {
                throw new Error("Missing id to update user");
            }
            try {
                let where = { id: user.id };
                let data = user;
                let updatedUser = yield prisma.user.update({ where, data });
                return updatedUser;
            }
            catch (error) {
                throw error;
            }
        });
    }
    deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let where = { id };
                let deletedUser = yield prisma.user.delete({ where });
                return deletedUser;
            }
            catch (error) {
                throw error;
            }
        });
    }
    isUserCreateInput(user) {
        return ((user === null || user === void 0 ? void 0 : user.name) !== undefined
            && (user === null || user === void 0 ? void 0 : user.email) !== undefined);
    }
    exclude(user, keys) {
        if (!user)
            return user;
        for (let key of keys) {
            delete user[key];
        }
        return user;
    }
}
const userRepository = new UserRepository();
export { userRepository };
//# sourceMappingURL=userRepository.js.map