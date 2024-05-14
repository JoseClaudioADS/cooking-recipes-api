import { Router } from "express";

import { db } from "../../infra/db/drizzle-db";
import { DrizzleMagicLinkRepository } from "../../infra/repository/drizzle-magic-link.repository";
import { DrizzlePhotosRepository } from "../../infra/repository/drizzle-photos.repository";
import { DrizzleRecipesRepository } from "../../infra/repository/drizzle-recipes.repository";
import { DrizzleUsersRepository } from "../../infra/repository/drizzle-users.repository";
import { LocalUploadService } from "../../infra/services/upload/local-upload.service";
import { MagicLinkController } from "./controllers/magic-link.controller";
import { PhotosController } from "./controllers/photos.controller";
import { RecipesController } from "./controllers/recipes.controller";
import { UsersController } from "./controllers/users.controller";
import { authMiddleware } from "./middlewares/auth.middleware";

const usersRepository = new DrizzleUsersRepository(db);
const magicLinkRepository = new DrizzleMagicLinkRepository(db);
const recipesRepository = new DrizzleRecipesRepository(db);
const photosRepository = new DrizzlePhotosRepository(db);

const uploadService = new LocalUploadService();

const usersController = new UsersController(usersRepository);
const magicLinkController = new MagicLinkController(
  usersRepository,
  magicLinkRepository,
);
const recipesController = new RecipesController(
  recipesRepository,
  uploadService,
);
const photosController = new PhotosController(photosRepository, uploadService);

// Users routes
const userRouter = Router();

userRouter.post("/", usersController.create.bind(usersController));

// Magic Link routes
const magicLinkRouter = Router();

magicLinkRouter.post("/", magicLinkController.create.bind(magicLinkController));
magicLinkRouter.get(
  "/sign-in",
  magicLinkController.signIn.bind(magicLinkController),
);

// Recipes routes
const recipesRouter = Router();

recipesRouter.post(
  "/",
  authMiddleware,
  recipesController.create.bind(recipesController),
);
recipesRouter.get("/", recipesController.search.bind(recipesController));
recipesRouter.get(
  "/categories",
  recipesController.getCategories.bind(recipesController),
);

// Photos routes
const photosRouter = Router();

photosRouter.post(
  "/",
  authMiddleware,
  photosController.create.bind(photosController),
);

// App routes
const appRouter = Router();

appRouter.use("/users", userRouter);
appRouter.use("/magic-link", magicLinkRouter);
appRouter.use("/recipes", recipesRouter);
appRouter.use("/photos", photosRouter);

export default appRouter;
