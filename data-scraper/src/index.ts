import express from "express";
import cors from "cors";
import { runDB } from "./db/db";
import {
    setData,
    sendData,
    setQueryData,
    sendQueryData,
    sendDataAndAppend,
    getAllObjects,
    writeData,
    deleteRerteivedData
} from "./scrapers/utils";
import * as scraper from "./scrapers/scraper";
import { keys } from "./environment/keys";
import { IItemsDTO } from "@models/interfaces/DTOs/IItemsDTO";
import { IData } from "@models/interfaces/IData";

const app: any = express();

app.use(cors());
app.use(express.json());

app.get("/", async (req: any, res: any) => {
    const data = await getAllObjects("Stores");

    if(data === undefined || data === null){
        return res.status(404).send({ status: "options unavailable"});
    }

    res.json(data);
});

app.get("/items", async (req: any, res: IItemsDTO | any) => {
    const data = await sendData();      // send data for scrape
    const itemsData: IData[] | undefined = data?.itemsData;
    const naviData = data?.naviData;
    const pagesData = data?.pagesData;

    if(data === undefined || data === null){    //TODO: midleware?
        return res.status(404).send({ status: "no data found"});
    }

    res.json({itemsData, naviData, pagesData});
    writeData(itemsData);
});

app.get("/items/query", async (req: any, res: any) => {
    const data = await sendQueryData();
    const itemsData = data?.itemsData;
    const naviData = data?.naviData;

    if(data === undefined || data === null){
        return res.status(404).send({ status: "no data found"});
    }
    
    res.json({itemsData, naviData});
});

app.get("/items?page", async (req: any, res: any) => {
    const data = await sendDataAndAppend();

    if(data === undefined || data === null){
        return res.status(404).send({ status: "no data found"});
    }

    res.json({});
});

app.get("/clear", (req: any, res: any) => {
    const data = scraper.clearData();
    req.json(data);
});

app.get("/query", async (req: any, res: any) => {
    const data = await sendQueryData();

    const itemsData = data?.itemsData;
    const naviData = data?.naviData;

    if(data === undefined || data === null){
        return res.status(404).send({ status: "no data found"});
    }
    
    res.json({itemsData, naviData});
});


app.post("/", async (req: any, res: any) => {
    const data = req.body;

    if (data === undefined || data === null){
        return res.status(400).send({ status: "failed" });
    }
    
    setData(data);
    res.status(200).send({ status: "success" });
});

app.post("/query", async (req: any, res: any) => {
    const data = req.body;

    if (data === undefined || data === null){
        return res.status(400).send({ status: "failed" });
    }

    res.status(200).send({ status: "success" });
    setQueryData(data);
});

app.listen(keys.port,  () => {
    console.log(`Server listening on port ${keys.port}`);
});

deleteRerteivedData({});

runDB();