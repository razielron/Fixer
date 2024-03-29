import { PrismaClient, User } from '@prisma/client';
import { UserModel } from '../models/dbModels.js';
import { Prisma as PrismaTypes } from '@prisma/client';

const prisma = new PrismaClient();

class UserRepository {
    public async getUser(userId : string) : Promise<UserModel> {
        try {
            let where = { id: userId };
            let user : UserModel = await prisma.user.findFirst({ where });

            return user;
        }
        catch(error : unknown) {
            throw error;
        }
    }

    public async getUserByEmail(email : string) : Promise<UserModel> {
        try {
            let where = { email };
            let user : UserModel = await prisma.user.findFirst({ where });

            return user;
        }
        catch(error : unknown) {
            throw error;
        }
    }

    public async getUsers(usersIds : string[]) : Promise<UserModel[]> {
        try {
            let where = { id: { in: usersIds } };
            let users : UserModel[] = await prisma.user.findMany({ where });

            return users;
        }
        catch(error : unknown) {
            throw error;
        }
    }

    public async getUsersByProfession(profession : string) : Promise<UserModel[]> {
        try {
            let where = { profession };
            let users : UserModel[] = await prisma.user.findMany({ where });

            return users;
        }
        catch(error : unknown) {
            throw error;
        }
    }

    public async getAllUsers() : Promise<UserModel[]> {
        try {
            let users : UserModel[] = await prisma.user.findMany();
            return users;
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
                
                return createdUser;
            }
            catch(error : unknown) {
                throw error;
            }
        }

        throw new Error("Missing argument to create a user");
    }

    public async updateUserByEmail(user: UserModel) : Promise<UserModel> {
        if(!user?.email) {
            throw new Error("Missing email to update user");
        }

        try {
            let where = { email: user.email };
            let data : PrismaTypes.UserUncheckedUpdateInput = user;
            let updatedUser: UserModel = await prisma.user.update({where, data});
            
            return updatedUser;
        }
        catch(error : unknown) {
            throw error;
        }

    }

    public async updateUser(user: UserModel) : Promise<UserModel> {
        if(!user?.id) {
            throw new Error("Missing id to update user");
        }

        try {
            let where = { id: user.id };
            let data : PrismaTypes.UserUncheckedUpdateInput = user;
            let updatedUser: UserModel = await prisma.user.update({where, data});
            
            return updatedUser;
        }
        catch(error : unknown) {
            throw error;
        }

    }

    public async deleteUser(id: string) : Promise<UserModel> {
        try {
            let where = { id };
            let deletedUser : UserModel = await prisma.user.delete({ where });

            return deletedUser;
        }
        catch(error : unknown) {
            throw error;
        }
    }

    private isUserCreateInput(user : UserModel) : user is PrismaTypes.UserCreateInput {
        return (user?.name !== undefined
            && user?.email !== undefined)
    }

    private exclude<Key extends keyof User>(
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