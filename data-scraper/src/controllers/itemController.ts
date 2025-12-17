import { IItemsDTO } from "@models/interfaces/DTOs/IItemsDTO";
import { IData } from "@models/interfaces/IData";
import * as itemService from "../services/itemService";
import { IStores } from "@models/interfaces/IStores";

export const getAllItems = async (req: any, res: any) => {
    if (!req.body){
        return res.status(400).send({ status: "failed" });
    }
    // req.body == siteName
    const data: IData[] | null = await itemService.getItems(req.body);

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