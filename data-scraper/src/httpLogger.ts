import { pinoHttp } from "pino-http";
import { logger } from "./logger.js";
import { v4 as uuid } from "uuid";

export const httpLogger = pinoHttp({
    logger,
    genReqId: () => uuid(),
});