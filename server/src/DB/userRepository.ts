import { PrismaClient, User } from '@prisma/client';
import { UserModel } from '../models/dbModels.js';
import { Prisma as PrismaTypes } from '@prisma/client';

const prisma = new PrismaClient();

class UserRepository {
    public async getUser(userId : string) : Promise<UserModel> {
        try {
            let where = { id: userId };
            let user : UserModel = await prisma.user.findFirst({ where });

            return this.exclude(user, ["password"]);
        }
        catch(error : unknown) {
            throw error;
        }
    }

    public async createUser(user: UserModel) : Promise<UserModel> {
        if(this.isUserCreateInput(user)) {
            try {
                let data : PrismaTypes.UserCreateInput = user;
                let createdUser : UserModel = await prisma.user.create({ data });
                
                return this.exclude(createdUser, ["password"]);
            }
            catch(error : unknown) {
                throw error;
            }
        }

        throw new Error("Missing argument to create a user");
    }

    public async updateUser(user: UserModel) : Promise<UserModel> {
        if(!user?.id) {
            throw new Error("Missing id to update user");
        }

        try {
            let where = { id: user.id };
            let data : PrismaTypes.UserUncheckedUpdateInput = user;
            let updatedUser: UserModel = await prisma.user.update({where, data});
            
            return this.exclude(updatedUser, ["password"]);
        }
        catch(error : unknown) {
            throw error;
        }

    }

    public async deleteUser(id: string) : Promise<UserModel> {
        try {
            let where = { id };
            let deletedUser : UserModel = await prisma.user.delete({ where });

            return this.exclude(deletedUser, ["password"]);
        }
        catch(error : unknown) {
            throw error;
        }
    }

    private isUserCreateInput(user : UserModel) : user is PrismaTypes.UserCreateInput {
        return (user?.name !== undefined
            && user?.email !== undefined
            && user?.password !== undefined)
    }

    exclude<Key extends keyof User>(
        user: UserModel,
        keys: Key[]
      ): UserModel {
        if(!user) return user;

        for (let key of keys) {
          delete user[key];
        }
        return user;
    }
}

const userRepository : UserRepository = new UserRepository();

export {
    userRepository
}