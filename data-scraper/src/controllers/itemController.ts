import { IData } from "../models/interfaces/IData.js";
import * as itemService from "../services/itemService.js";
import { IStores } from "../models/interfaces/IStores.js";

export const getAllItems = async (req: any, res: any) => {
    if (!req.query){
        return res.status(400).send({ status: "failed: no query string provided in URI" });
    }

    const { store, gender, category }: any = req.query;

    const data: IData[] | null = await itemService.getItems(store, gender, category);

    if(!data){
        return res.status(404).send({ status: "no data found"});
    }

    res.status(200).json(data);
};

export const getAllStoreItems = async (req: any, res: any) => { // return DTO
    const data: IStores[] | undefined = await itemService.getAllStores("Stores");

    if(!data){
        return res.status(404).send({ status: "options unavailable"});
    }

    res.status(200).json(data);
};