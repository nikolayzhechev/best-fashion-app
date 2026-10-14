import { fallbackProxyList } from "../scrapers/proxyList.js";
import { IProxyData } from "../models/interfaces/IProxyData.js";
import { IProxy } from "../models/interfaces/IProxy.js";
import dbConfig from "../db/dbConfig.js";

export async function getRandomProxy(): Promise<IProxyData> {
    let proxyList: IProxy[];
    const proxyResult: IProxy[] | null = await getProxyList();

    if (!proxyResult) {
        proxyList = fallbackProxyList;
    } else {
        proxyList = proxyResult;
    }

    let randomServerIndex: number = Math.floor(Math.random() * proxyList.length);
    const serverObject: IProxy = proxyList[randomServerIndex];

    const proxyData: IProxyData = {
        server: serverObject.ip + ":" + serverObject.port,
        protocol: serverObject.protocol
    }

    console.log(`Proxy data: ${proxyData.server}`);

    return proxyData;
};

async function getProxyList(): Promise<IProxy[] | null> {
    const proxyList = await dbConfig.db.collection<IProxy>(dbConfig.allCollections.proxies)
        .find().toArray();  // { ip: "", port: [], protocol: "" }

    if (proxyList.length === 0) {
        return null;
    }
    
    return proxyList;
};