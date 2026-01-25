import express from "express";
import cors from "cors";
import { runDB, validateDBConfig } from "./db/db.js";
import { keys } from "./environment/keys.js";
import itemsRouter from "./routes/itemRoutes.js";
import { httpLogger } from "httpLogger.js";

const app: any = express();

app.use(httpLogger);
app.use(cors());
app.use(express.json());

app.use("/", itemsRouter);

async function start() {
    try {
        validateDBConfig();
        await runDB();

        app.listen(keys.port,  () => {
            console.log(`Server listening on port ${keys.port}`);
        });
    } catch (err) {
        console.log("Startup failed: ", err);
        process.exit(1);
    }
}

start();