import { CardRefer } from "../utils/refers/card";
import { CastableModel } from "./castable";
import { FeatureListModel } from "./feature";
import { Chunk, Def, Dict, Event, Model, NodeModel, Props, Validator } from "@/set-piece";
import { MinionModel } from "./minion";

export type TargetCollector<T = any>  = {
    hint: string;
    uuid: string;
    result?: T;
    validator: (
        target: Model, 
        list: TargetCollector[]
    ) => boolean;
}

export type TargetCollectorInfo = {
    list: TargetCollector[];
    index: number;
    runner: (list: TargetCollector[]) => void;
}

export type CardDef<
    T extends Def = Def
> = Def.Create<{
    code: string;
    stateDict: {
    },
    paramDict: {
        readonly name: string;
        readonly desc: string;
    }
    eventDict: {
        onTargetCheck: [TargetCollector[]] 
    },
    childDict: {
        castable: CastableModel,
        featureList: FeatureListModel,
    }
}> & T


export abstract class CardModel<
    T extends CardDef = CardDef
> extends NodeModel<T> {
    _cardEventDict: Readonly<Event.Dict<
        Def.EventDict<CardDef<Def.Pure>>
    >> = this.eventDict;
   

    static cardProps<T extends CardDef>(
        props: Props<T>
    ) {
        const childDict: Dict.Strict<Chunk.Dict<
            Def.ChildDict<CardDef<Def.Pure>>
        >> = {
            featureList: { code: 'feature-list' },
            castable: { code: 'castable' },
            ...props.childDict
        };
        return {
            ...props,
            childDict
        };
    }

    readonly refer: CardRefer;

    constructor(props: Props.Strict<T>) {
        super(props);
        this.refer = new CardRefer(this);
    }
    
    @Validator.useCondition(model => Boolean(model.refer.hand))
    prepare(): TargetCollectorInfo | undefined {
        const targetCollectorList: TargetCollector[] = [];
        this._cardEventDict.onTargetCheck(targetCollectorList);
        console.log('[target collector list]', targetCollectorList);
        if (!targetCollectorList.length) {
            this.play([]);
            return undefined;
        }
        return {
            list: targetCollectorList,
            index: 0,
            runner: this.play.bind(this)
        };
    }

    @Validator.useCondition(model => Boolean(model.refer.hand))
    play(collectorList: TargetCollector[]) {
        this.refer.playerHand?.playCard(this);
    }

    @Validator.useCondition(model => Boolean(model.refer.deck))
    pick() {
        this.refer.player?.childDict.deck.drawCard(this);
    }

    debug() {
        super.debug();
        this.childDict.combatable?.debug();
    }
}