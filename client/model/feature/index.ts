import { Factory } from "@/service/factory";
import { Def } from "@/type/define";
import { NodeModel } from "../node";
import { Props } from "@/type/props";
import { Dict } from "@/type/base";
import { CardModel } from "../card";

export type FeatureListDef = Def.Create<{
    code: 'feature-list',
    stateDict: {},
    paramDict: {},
    childList: FeatureModel[],
    eventDict: {},
    parent: CardModel<Def.Pure>
}>

export type FeatureDef = Def.Create<{
    code: string,
    stateDict: {
    },
    paramDict: {
        readonly name: string;
        readonly desc: string;
    }
    childList: [],
    eventDict: {},
    parent: CardModel<Def.Pure> | FeatureListModel
}>

@Factory.useProduct('feature-list')
export class FeatureListModel extends NodeModel<FeatureListDef> {
    constructor(props: Props<FeatureListDef>) {
        super({
            childList: [],
            ...props,
            childDict: {},
            stateDict: {},
            paramDict: {}
        });
    }
}

export abstract class FeatureModel<
    T extends Def = Def
> extends NodeModel<T & FeatureDef> {
    static superProps(props: Props<FeatureDef>) {
        return props;
    }

    get card(): CardModel<Def.Pure> {
        return this.parent instanceof CardModel ? this.parent : this.parent.parent;
    }

    // get stateDict() {
    //     return {
    //         ...super.stateDict,
    //         card: this.card
    //     };
    // }
}