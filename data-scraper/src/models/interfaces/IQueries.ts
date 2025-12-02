import { ObjectId } from "mongodb";
import { IAttributes } from "./IAttributes";

export interface IQueries {
    readonly _id: ObjectId,
    site: string,
    navi: IAttributes,
    woman: object,
    men: object
};