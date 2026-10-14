import { IDataDTO } from "./IDataDTO.js";
import { INaviDTO } from "./INaviDTO.js";

export interface IItemsDTO {
    itemsData: IDataDTO[],
    naviData: INaviDTO[],
    pagesData: any[]
};