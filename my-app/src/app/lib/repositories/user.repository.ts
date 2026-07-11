import { prisma } from "../prisma";
import { Role } from "@prisma-generated";

export class UserRepository {
    //Read
    findById(id: number)
    {
        return prisma.user.findUnique({
            where: { id} });
    }

    findByEmail(email: string)
    {
        return prisma.user.findUnique({
            where: { email } });
    }

    findByUsername(username: string)
    {
        return prisma.user.findUnique({
            where: { username } });
    }

    findAll()
    {
        return prisma.user.findMany();
    }

    //Create
    create(
     data: 
        { 
            username: string;
            email: string; 
            passwordHash: string; 
            role: Role 
            
        }){
            return prisma.user.create({
                data: data
            });
        }
}