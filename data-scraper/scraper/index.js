import { createRequire } from "module";
import * as dataHandle from "./scraper.js";

const require = createRequire(import.meta.url);
const express = require("express");
const cors = require("cors");

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

let userData = {
    url: "",
    siteName: "",
    type: ""
}

async function executeScrape (siteName, type, executiontype){
    if (executiontype === "dynamic") {
        return await dataHandle.scrapeDynamicData(siteName, type);
    } else if (executiontype === "static"){
        return dataHandle.scrapeStaticData();
    }
    return null;
}

app.get("/", async (req, res) => {
    //res.setHeader('Content-Type', 'application/json');
    const data = await executeScrape(userData.siteName, userData.type, "dynamic");

    console.log(`Returned data from scrape: ${data.title} + ${data.itemUrl}`);

    res.json(data);
})

app.get("/clear", (req, res) => {
    const data = dataHandle.clearData();
    req.json(data);
})

app.post("/", async (req, res) => {
    const data = req.body;
    
    if (!data){
        return res.status(400).send({ status: "failed" })
    }
    res.status(200).send({ status: "success" })

    userData.url = data.url;
    userData.siteName = data.siteName;
    userData.type = data.type;
})

app.listen(port,  () => {
    console.log(`Server listening on port ${port}`);
})
