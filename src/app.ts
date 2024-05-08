import express from "express";
import morgan from "morgan";
import logger from "./utils/logger";

const app = express();

app.use(express.json());
app.use(morgan("common"));

app.listen(3000, () => {
    logger.info("Server running on port 3000");
});
