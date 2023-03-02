import { PrismaClient } from '@prisma/client';
import { User } from '../models/dbModels.js';

const prisma = new PrismaClient();



async function main() {
    const user : User = {
        name: "hi"
    }

    let createdUser: User = await prisma.user.create({data: user});
    let findUSer : User = await prisma.user.findFirst();

    //console.log({user})
}

main()
    .catch(err => {
        console.log({err});
    })
    .finally(async () => {
        prisma.$disconnect();
    });