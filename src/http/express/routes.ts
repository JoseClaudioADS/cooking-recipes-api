import { Router } from "express";
import prisma from "../../infra/prisma-db";
import { PrismaMagicLinkRepository } from "../../infra/repository/prisma-magic-link.repository";
import { PrismaUsersRepository } from "../../infra/repository/prisma-users.repository";
import { MagicLinkController } from "./controllers/magic-link.controller";
import { UsersController } from "./controllers/users.controller";

const usersRepository = new PrismaUsersRepository(prisma);
const magicLinkRepository = new PrismaMagicLinkRepository(prisma);

const usersController = new UsersController(usersRepository);
const magicLinkController = new MagicLinkController(usersRepository, magicLinkRepository);

// Users routes
const userRouter = Router();

userRouter.post("/", usersController.create.bind(usersController));

// Magic Link routes
const magicLinkRouter = Router();

magicLinkRouter.post("/", magicLinkController.create.bind(magicLinkController));
magicLinkRouter.get("/sign-in", magicLinkController.signIn.bind(magicLinkController));

// App routes
const appRouter = Router();

appRouter.use("/users", userRouter);
appRouter.use("/magic-link", magicLinkRouter);

export default appRouter;
