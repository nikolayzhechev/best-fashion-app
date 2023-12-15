import { client } from "./db.js";

const dbName = "BFA";
const db = client.db(dbName);
const storesCollection = "Stores";
const queryCollection = "Queries";
const retreivedDataCollection = "RetreivedData";

export default {
    db,
    dbName,
    storesCollection,
    queryCollection,
    retreivedDataCollection
}