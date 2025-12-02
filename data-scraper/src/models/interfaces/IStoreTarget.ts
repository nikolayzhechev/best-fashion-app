import { IStoreTargetMetadata } from "./IStoreTargetMetadata"

export interface IStoreTarget {
    tag: string,
    class: string,
    metadata: IStoreTargetMetadata
    img: {
        class: string,
        tag: string,
        refTag: string
    }
};