import { MongoClient, ServerApiVersion } from 'mongodb';
import { keys } from "../environment/keys.js";

export function validateDBConfig() {
    if (!keys.mdbUser || !keys.mdbPassword || !keys.mdbDataBaseName) {
        throw new Error("Missing MongoDB configuration (user, password, or database name)");
    }
}

const username = keys.mdbUser;
const password = keys.mdbPassword;

// make sure IP address is whitelisted for DB
const uri = `mongodb+srv://${encodeURIComponent(username)}:${encodeURIComponent(password)}@cluster0.lm4eduw.mongodb.net/?retryWrites=true&w=majority`;

export const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

client.on("error", (err) => {
    console.error("MongoDB client error:", err);
    process.exit(1);
});

export async function runDB() {
    try {
        await client.connect();
        await client.db(keys.mdbDataBaseName).command({ ping: 1 });
        console.log("DB connected");
    } catch (error) {
        console.error("DB connection failed:", error);

        if (error instanceof Error) {
            console.error(error.stack);
        }

        process.exit(1);
    }
};