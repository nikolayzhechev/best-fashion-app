import { IDataDTO } from "./IDataDTO";
import { INaviDTO } from "./INaviDTO";

export interface IItemsDTO {
    itemsData: IDataDTO[],
    naviData: INaviDTO[],
    pagesData: any[]
};