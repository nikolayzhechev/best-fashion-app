import { createRequire } from "module";
import { scrapeStaticData, ScrapeDynamicData } from "./scrapper.js";
import { urlData } from "./utils.js";
const require = createRequire(import.meta.url);

const express = require("express");
const cors = require("cors");
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

let data = await ScrapeDynamicData();

app.get("/", (req, res) => {
    //res.setHeader('Content-Type', 'application/json');
    res.json(data);
})

app.listen(port,  () => {
    console.log(`Server listening on port ${port}`);
})
