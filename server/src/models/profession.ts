import { Profession } from '@prisma/client';

export default function GetProfessionEnumByString(profession: string) {
    return Profession[profession.toUpperCase() as keyof typeof Profession];
}