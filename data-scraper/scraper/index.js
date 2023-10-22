import { createRequire } from "module";
import { runDB } from "./db.js";
import { setData, sendData } from "./utils.js";
import * as dataHandle from "./scraper.js";

const require = createRequire(import.meta.url);
const express = require("express");
const cors = require("cors");

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
    //res.setHeader('Content-Type', 'application/json');
    const data = await sendData();

    if(data === undefined || data === null){
        return res.status(404).send({ status: "no data found"});
    }

    res.json(data);
})

app.get("/clear", (req, res) => {
    const data = dataHandle.clearData();
    req.json(data);
})

app.post("/", async (req, res) => {
    const data = req.body;

    if (data === undefined || data === null){
        return res.status(400).send({ status: "failed" });
    }
    res.status(200).send({ status: "success" })

    setData(data);
})

app.listen(port,  () => {
    console.log(`Server listening on port ${port}`);
})

runDB();