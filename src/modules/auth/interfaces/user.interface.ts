import { Role } from '@prisma/client';

export type TUser = {
  id: string;
  email: string;
  password: string;
  role: Role;
};
