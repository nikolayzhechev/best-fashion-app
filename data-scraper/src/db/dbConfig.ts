import { Db } from "mongodb";
import { client } from "./db.js";
import { IDbCollections } from "../models/interfaces/IDbCollections.js";

const dbName: string = "BFA";
const db: Db = client.db(dbName);
const allCollections: IDbCollections = {
    stores: "Stores",
    queries: "Queries",
    data: "Data",
    proxies: "Proxies"
}

export default {
    db,
    dbName,
    allCollections
}