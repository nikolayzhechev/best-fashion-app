import pino from "pino";

export const logger: pino.Logger = pino({
    level: process.env.LOG_LEVEL || "info",
    base: {
        service: "server",
        env: process.env.NODE_ENV || "development",
    },
    timestamp: pino.stdTimeFunctions.isoTime
});