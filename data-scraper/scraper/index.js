import { createRequire } from "module";
import * as dataHandle from "./scraper.js";

const require = createRequire(import.meta.url);
const express = require("express");
const cors = require("cors");

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

async function executeScrape (type){
    if (type === "dynamic") {
        return await dataHandle.ScrapeDynamicData();
    } else if (type === "static"){
        return dataHandle.scrapeStaticData();
    }
    return null;
}

app.get("/", async (req, res) => {
    //res.setHeader('Content-Type', 'application/json');
    const data = await executeScrape("dynamic");
    res.json(data);
})

app.get("/clear", (req, res) => {
    const data = dataHandle.clearData();
    req.json(data);
})

app.listen(port,  () => {
    console.log(`Server listening on port ${port}`);
})
