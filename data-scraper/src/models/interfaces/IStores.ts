import { ObjectId } from "mongodb";
import { IStoreTarget } from "./IStoreTarget";

export interface IStores {
    readonly _id: ObjectId,
    name: string,
    url: string,
    queries: {
        woman: string,
        men: string
    },
    target: IStoreTarget,
    pagination: string
};