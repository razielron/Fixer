import { PrismaClient, User } from '@prisma/client';
import { UserModel } from '../models/dbModels.js';
import { Prisma as PrismaTypes } from '@prisma/client';

const prisma = new PrismaClient();

class UserRepository {
    public async getUser(userId : string) : Promise<UserModel> {
        let where = { id: userId };
        let user : UserModel = await prisma.user.findFirst({ where });

        return user;
    }

    public async createUser(user: UserModel) : Promise<UserModel> {
        if(this.isUserCreateInput(user)) {
            let data : PrismaTypes.UserCreateInput = user;
            let createdUser : UserModel = await prisma.user.create({ data });
            return createdUser;
        }

        throw new Error("Missing argument to create a user");
    }

    public async updateUser(user: UserModel) : Promise<UserModel> {
        if(!user?.id) {
            throw new Error("Missing id to update user");
        }

        let where = { id: user.id };
        let data : PrismaTypes.UserUncheckedUpdateInput = user;
        let updatedUser: UserModel = await prisma.user.update({where, data});

        return updatedUser;
    }

    public async deleteUser(id: string) : Promise<UserModel> {
        let where = { id };
        let deletedUser = prisma.user.delete({ where });

        return deletedUser;
    }

    private isUserCreateInput(user : UserModel) : user is PrismaTypes.UserCreateInput {
        return (user?.name !== undefined
            && user?.email !== undefined
            && user?.password !== undefined)
    }
}