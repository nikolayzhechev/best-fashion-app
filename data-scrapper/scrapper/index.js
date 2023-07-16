import { createRequire } from "module";
import { ScrapeDynamicData } from "./scrapper.js";

const require = createRequire(import.meta.url);
const express = require("express");
const cors = require("cors");

// for proxy setup - not used
// const morgan = require("morgan");
// const { createProxyMiddleware } = require("http-proxy-middleware");
// require("dotenv").config();

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
