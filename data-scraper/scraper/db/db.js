import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { MongoClient, ServerApiVersion } = require('mongodb');
import { keys } from "../environment/keys.js";

const username = keys.mdbUser;
const password = keys.mdbPassword;
// make sure IP address is whitelisted for DB
const uri = `mongodb+srv://${username}:${password}@cluster0.lm4eduw.mongodb.net/?retryWrites=true&w=majority`;

export const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

export async function runDB() {
    try {
        await client.connect();
        await client.db(keys.mdbDataBaseName).command({ ping: 1 });
        console.log("DB connected");
    } catch (error) {
        console.log(error);
    }
}