import { Role } from 'src/generated/prisma/enums';

export type TUser = {
  id: string;
  email: string;
  password: string;
  role: Role;
};
