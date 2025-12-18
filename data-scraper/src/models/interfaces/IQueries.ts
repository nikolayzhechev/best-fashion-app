import { ObjectId } from "mongodb";
import { IAttributes } from "./IAttributes";
import { ICategories } from "./ICategories";

export interface IQueries {
    readonly _id: ObjectId,
    site: string,
    navi: IAttributes,
    woman: ICategories,
    men: ICategories
};