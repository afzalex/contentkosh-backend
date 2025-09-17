import { UserRole } from "@prisma/client";
import { Request } from "express";

export const { ADMIN, TEACHER, STUDENT, SUPERADMIN, GUEST } = UserRole;

export interface LoginDto {
    email: string;
    password: string;
}


export interface IUser {
    id: number;
    email: string;
    name: string;
    businessId: number
    role: UserRole;
}

export interface AuthRequest extends Request {
    user?: IUser;
}

