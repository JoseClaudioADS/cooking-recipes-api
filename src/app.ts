import cookieParser from "cookie-parser";
import "dotenv/config";
import express from "express";
import "express-async-errors";
import fileUpload from "express-fileupload";
import morgan from "morgan";
import errorHandler from "./http/express/error.handler";
import appRouter from "./http/express/routes";
import logger from "./utils/logger";

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("common"));
app.use(cookieParser());
app.use(fileUpload());

app.use("/api", appRouter);

app.use(errorHandler);

app.listen(3000, () => {
    logger.info("Server running on port 3000");
});
