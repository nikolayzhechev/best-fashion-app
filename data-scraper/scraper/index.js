import { createRequire } from "module";
import { runDB } from "./db/db.js";
import {
    setData,
    sendData,
    setQueryData,
    sendQueryData,
    getAllObjects,
    writeData,
    deleteRerteivedData
} from "./utils.js";
import * as dataHandle from "./scraper.js";

const require = createRequire(import.meta.url);
const express = require("express");
const cors = require("cors");

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
    const data = await getAllObjects();

    if(data === undefined || data === null){
        return res.status(404).send({ status: "options unavailable"});
    }

    res.json(data);
});

app.get("/getItems", async (req, res) => {
    const data = await sendData();
    const itemsData = data.itemsData;
    const naviData = data.naviData;
    const pagesData = data.pagesData;

    if(data === undefined || data === null){
        return res.status(404).send({ status: "no data found"});
    }

    res.json({itemsData, naviData, pagesData});
    // write the returned to client data to Db
    writeData(itemsData);
});

app.get("/getQueryItems", async (req, res) => {
    const data = await sendQueryData();
    const itemsData = data.itemsData;
    const naviData = data.naviData;

    if(data === undefined || data === null){
        return res.status(404).send({ status: "no data found"});
    }
    
    res.json({itemsData, naviData});
});

app.get("/clear", (req, res) => {
    const data = dataHandle.clearData();
    req.json(data);
});

app.post("/", async (req, res) => {
    const data = req.body;

    if (data === undefined || data === null){
        return res.status(400).send({ status: "failed" });
    }
    res.status(200).send({ status: "success" })

    setData(data);
});

app.post("/query", async (req, res) => {
    const data = req.body;

    if (data === undefined || data === null){
        return res.status(400).send({ status: "failed" });
    }
    res.status(200).send({ status: "success" })
    // TODO: call new function with query data
    setQueryData(data);
});

app.listen(port,  () => {
    console.log(`Server listening on port ${port}`);
});

deleteRerteivedData();

runDB();