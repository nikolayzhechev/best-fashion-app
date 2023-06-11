import { createRequire } from "module";
const require = createRequire(import.meta.url);

const express = require("express");
const app = express();
const port = 5000;

import { scrapeData } from "./scrapper.js";

app.listen(port,  () => {
    console.log(`Server listening on port ${port}`);
})

try {
    scrapeData();
    console.log("Scraper started");
} catch (error) {
    console.log(error);
}
