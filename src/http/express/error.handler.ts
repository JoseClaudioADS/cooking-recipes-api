import { Request, Response } from "express";
import { ZodError } from "zod";
import { BusinessError } from "../../core/shared/errors/business.error";
import { UnauthorizedError } from "../../core/shared/errors/unauthorized.error";
import logger from "../../utils/logger";

const errorHandler = (err: Error, req: Request, res: Response, _: () => unknown) => {

    if (err instanceof ZodError) {
        logger.debug(err.issues);
        res.status(400).send("Invalid input");
    } else if (err instanceof BusinessError) {
        const errObject = {
            code: err.code,
            message: err.message,
            timestamp: new Date().toISOString()
        };

        res.status(400).send(errObject);
        logger.debug(errObject);
    } else if (err instanceof UnauthorizedError) {
        res.status(401).send();
    } else {
        logger.error(err);
        res.status(500).send({ error: err.message });
    }
};

export default errorHandler;
