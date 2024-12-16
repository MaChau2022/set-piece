import { Def } from "@/type/define";
import { CardDef, CardModel, TargetCollector } from "./card";
import { Props } from "@/type/props";
import { MinionDef, MinionModel } from "./minion";
import { FeatureModel, FeatureDef } from "../feature";
import { Factory } from "@/service/factory";
import { Lifecycle } from "@/service/lifecycle";
import { BoardModel } from "../board";
import { BuffDef, BuffModel } from "../buff";
import { Chunk } from "@/type/chunk";

/**
 * @propmt
 * Abusive Sergeant  Battlecry: Give a minion +2 Attack this turn
 * use GameModel event onRoundEnd 
 */ 
export type AbusiveSergeantDef = Def.Create<{
    code: 'abusive-sergeant',
    childDict: {
        battlecry: BattlecryAbusiveSergeantModel
    }
}>


@MinionModel.useRule({
    manaCost: 1,
    health: 1,
    attack: 2,
    races: []
})
@Factory.useProduct('abusive-sergeant')
export class AbusiveSergeantModel extends MinionModel<AbusiveSergeantDef> {
    constructor(props: Props<AbusiveSergeantDef & CardDef & MinionDef>) {
        const superProps = MinionModel.minionProps(props);
        super({
            ...superProps,
            stateDict: {},
            paramDict: {
                races: [],
                name: 'Abusive Sergeant',
                desc: 'Battlecry: Give a minion +2 Attack this turn.'
            },
            childDict: {
                battlecry: { code: 'battlecry-abusive-sergeant' },
                ...superProps.childDict
            }
        });
    }

    debug() {
        super.debug();
        this.childDict.battlecry.debug();
    }
}

export type BattlecryAbusiveSergeantDef = Def.Create<{
    code: 'battlecry-abusive-sergeant',
    parent: AbusiveSergeantModel
}>

@Factory.useProduct('battlecry-abusive-sergeant')
export class BattlecryAbusiveSergeantModel extends FeatureModel<BattlecryAbusiveSergeantDef> {
    constructor(props: Props<BattlecryAbusiveSergeantDef & FeatureDef>) {
        super({
            ...props,
            paramDict: {
                name: 'Abusive Sergeant\'s Battlecry',
                desc: 'Give a minion +2 Attack this turn.'
            },
            stateDict: {},
            childDict: {}
        });
    }

    @Lifecycle.useLoader()
    private _handleBattlecry() {
        if (this.card instanceof MinionModel) {
            const card: MinionModel<Def.Pure> = this.card;
            this.bindEvent(
                card.eventEmitterDict.onBattlecry,
                (target, targetCollectorList) => {
                    const targetCollector = targetCollectorList.find(
                        item => item.uuid === this.uuid
                    );
                    if (targetCollector?.result instanceof MinionModel) {
                        const card: MinionModel<Def.Pure> = targetCollector.result;
                        const chunk: Chunk<BuffAbusiveSergeantDef> = {
                            code: 'buff-abusive-sergeant'
                        };
                        card.childDict.featureList.addFeature(chunk);
                    }
                }
            );
        }
    }

    @Lifecycle.useLoader()
    private _handleTargetCheck() {
        this.bindEvent(
            this.card.eventEmitterDict.onTargetCheck,
            (targetCollectorList: TargetCollector[]) => {
                const length =
                    this.card.opponent.childDict.board.childList.length +
                    this.card.player.childDict.board.childList.length;
                if (length) {
                    targetCollectorList.push({
                        uuid: this.uuid,
                        hint: 'Choose a minion.',
                        validator: (target) => {
                            // Any other minion on the board
                            const result = target instanceof CardModel &&
                                target.parent instanceof BoardModel &&
                                target !== this.card;
                            return result;
                        }
                    });
                }
            }
        );
    }
}

export type BuffAbusiveSergeantDef = Def.Create<{
    code: 'buff-abusive-sergeant',
}>

@Factory.useProduct('buff-abusive-sergeant')
export class BuffAbusiveSergeantModel extends BuffModel<BuffAbusiveSergeantDef> {
    constructor(props: Props<BuffAbusiveSergeantDef & BuffDef & FeatureDef>) {
        const buffProps = BuffModel.buffProps(props);
        super({
            ...buffProps,
            paramDict: {
                name: 'Abusive Sergeant\'s Buff',
                desc: 'Give a minion +2 Attack this turn.',
                modAttack: 2,
                modHealth: 0,
                disposeOnRoundEnd: true
            },
            stateDict: {},
            childDict: {}
        });
    }
}
