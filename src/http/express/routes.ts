import { Router } from "express";
import { UsersRepository } from "../../core/users/repository/users.repository";
import { UsersController } from "./controllers/users.controller";

const usersRepository: UsersRepository = {
    createUser: {},
    findByEmail: {}
} as UsersRepository;

const usersController = new UsersController(usersRepository);

// Users routes
const userRouter = Router();

userRouter.post("/", usersController.create.bind(usersController));

// App routes
const appRouter = Router();

appRouter.use("/users", userRouter);

export default appRouter;
