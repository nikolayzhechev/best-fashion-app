import { IStoreTargetMetadata } from "./IStoreTargetMetadata.js"

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