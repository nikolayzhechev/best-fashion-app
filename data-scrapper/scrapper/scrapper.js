import { urlData } from "./utils.js";
import { createRequire } from "module";
const require = createRequire(import.meta.url);

const axios = require("axios");
const cheerio = require("cheerio");

export function scrapeData () {
    const url = urlData("zara", "woman");
        axios(url)
        .then(response => {
            const html = response.data;
            const $ = cheerio.load(html);
            console.log(html);
        })
        .catch(console.error);
}