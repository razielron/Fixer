import { Profession } from '@prisma/client';
export default function GetProfessionEnumByString(profession) {
    return Profession[profession.toUpperCase()];
}
//# sourceMappingURL=profession.js.map