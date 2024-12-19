import { Base, Dict } from "./base";
import { Model } from "./model";

export type Def = {
    code: string;
    stateDict: Base.Dict<Base.Values>
    paramDict: Base.Dict<Base.Values>
    childList: Model[]
    childDict: Base.Dict<Model>
    eventDict: Base.Dict<Base.List>    
    parent?: Model
}

export type CustomDef<
    T extends Partial<Def> = {}
> =  Dict.Override<T, {
    code: string,
    stateDict: {},
    paramDict: {},
    childList: [],
    childDict: {},
    eventDict: {},
    parent: Model
}>

export namespace Def {
    export type Code<T extends Def> = T["code"]
    export type StateDict<T extends Def> = T["stateDict"]
    export type ParamDict<T extends Def> = T["paramDict"]
    export type ChildList<T extends Def> = T["childList"]
    export type ChildDict<T extends Def> = T["childDict"]
    export type EventDict<T extends Def> = T["eventDict"]
    export type Parent<T extends Def> = T["parent"]
}