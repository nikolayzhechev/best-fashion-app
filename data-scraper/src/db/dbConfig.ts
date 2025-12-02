import { client } from "./db";

const dbName = "BFA";
const db = client.db(dbName);
const allCollections = {
    storesCollection: "Stores",
    queryCollection: "Queries",
    retreivedDataCollection: "RetreivedData"
}

export default {
    db,
    dbName,
    allCollections
}