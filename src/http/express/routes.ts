import { Router } from "express";
import prisma from "../../infra/prisma-db";
import { PrismaUsersRepository } from "../../infra/repository/prisma-users.repository";
import { MagicLinkController } from "./controllers/magic-link.controller";
import { UsersController } from "./controllers/users.controller";

const usersRepository = new PrismaUsersRepository(prisma);

const usersController = new UsersController(usersRepository);
const magicLinkController = new MagicLinkController(usersRepository);

// Users routes
const userRouter = Router();

userRouter.post("/", usersController.create.bind(usersController));

// Magic Link routes
const magicLinkRouter = Router();

magicLinkRouter.post("/", magicLinkController.create.bind(magicLinkController));

// App routes
const appRouter = Router();

appRouter.use("/users", userRouter);
appRouter.use("/magic-link", magicLinkRouter);

export default appRouter;
