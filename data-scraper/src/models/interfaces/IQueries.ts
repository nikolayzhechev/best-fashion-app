import { ObjectId } from "mongodb";
import { IAttributes } from "./IAttributes.js";
import { ICategories } from "./ICategories.js";

export interface IQueries {
    readonly _id: ObjectId,
    site: string,
    navi: IAttributes,
    woman: ICategories,
    men: ICategories
};