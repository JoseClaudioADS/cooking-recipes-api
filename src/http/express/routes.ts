import { Router } from "express";
import prisma from "../../infra/prisma-db";
import { PrismaUsersRepository } from "../../infra/repository/prisma-users.repository";
import { UsersController } from "./controllers/users.controller";

const usersRepository = new PrismaUsersRepository(prisma);

const usersController = new UsersController(usersRepository);

// Users routes
const userRouter = Router();

userRouter.post("/", usersController.create.bind(usersController));

// App routes
const appRouter = Router();

appRouter.use("/users", userRouter);

export default appRouter;
