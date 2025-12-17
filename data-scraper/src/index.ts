import express from "express";
import cors from "cors";
import { runDB } from "./db/db";
import { keys } from "./environment/keys";

const app: any = express();

app.use(cors());
app.use(express.json());

import itemsRouter from "./routes/itemRoutes";

app.use("/", itemsRouter);

app.listen(keys.port,  () => {
    console.log(`Server listening on port ${keys.port}`);
});

runDB();