import { Request, Response } from "express";
import { ZodError } from "zod";
import { BusinessError } from "../../core/shared/errors/business.error";
import logger from "../../utils/logger";

const errorHandler = (err: Error, req: Request, res: Response, _: () => unknown) => {

    if (err instanceof ZodError) {
        logger.debug(err.issues);
        res.status(400).send("Invalid input");
    } else if (err instanceof BusinessError) {
        logger.debug(err);
        res.status(400).send({
            code: err.code,
            message: err.message,
            timestamp: new Date().toISOString()
        });
    } else {
        logger.error(err);
        res.status(500).send({ error: err.message });
    }
};

export default errorHandler;
