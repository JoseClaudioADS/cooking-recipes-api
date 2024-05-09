import { Router } from "express";
import prisma from "../../infra/prisma-db";
import { PrismaMagicLinkRepository } from "../../infra/repository/prisma-magic-link.repository";
import { PrismaRecipesRepository } from "../../infra/repository/prisma-recipes.repository";
import { PrismaUsersRepository } from "../../infra/repository/prisma-users.repository";
import { MagicLinkController } from "./controllers/magic-link.controller";
import { RecipesController } from "./controllers/recipes.controller";
import { UsersController } from "./controllers/users.controller";
import { authMiddleware } from "./middlewares/auth.middleware";

const usersRepository = new PrismaUsersRepository(prisma);
const magicLinkRepository = new PrismaMagicLinkRepository(prisma);
const recipesRepository = new PrismaRecipesRepository(prisma);

const usersController = new UsersController(usersRepository);
const magicLinkController = new MagicLinkController(usersRepository, magicLinkRepository);
const recipesController = new RecipesController(recipesRepository);

// Users routes
const userRouter = Router();

userRouter.post("/", usersController.create.bind(usersController));

// Magic Link routes
const magicLinkRouter = Router();

magicLinkRouter.post("/", magicLinkController.create.bind(magicLinkController));
magicLinkRouter.get("/sign-in", magicLinkController.signIn.bind(magicLinkController));

// Recipes routes
const recipesRouter = Router();

recipesRouter.post("/", authMiddleware, recipesController.create.bind(recipesController));

// App routes
const appRouter = Router();

appRouter.use("/users", userRouter);
appRouter.use("/magic-link", magicLinkRouter);
appRouter.use("/recipes", recipesRouter);

export default appRouter;
