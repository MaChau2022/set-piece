// import { Def } from "@/type/define";
// import { CardDef } from "./card";
// import { Props } from "@/type/props";
// import { MinionDef, MinionModel } from "./minion";
// import { FeatureModel, FeatureDef } from "../feature";
// import { Factory } from "@/service/factory";
// import { RaceType } from "@/service/database";
// import { Lifecycle } from "@/service/lifecycle";
// import { GameModel } from "../game";
// import { Random } from "@/util/random";
// import { BuffDef, BuffModel } from "../buff";
// import { Chunk } from "@/type/chunk";

// /**
//  * @prompt
//  * Blood Imp  1/0/1  At the end of your turn, give another random friendly minion +1 Health.
//  */

// export type BloodImpDef = Def.Create<{
//     code: 'blood-imp',
//     childDict: {
//         effectBloodImp: EffectBloodImpModel
//     }
// }>

// @MinionModel.useRule({
//     manaCost: 1,
//     health: 1,
//     attack: 0,
//     races: [ RaceType.Demon ]
// })
// @Factory.useProduct('blood-imp')
// export class BloodImpModel extends MinionModel<BloodImpDef> {
//     constructor(props: Props<BloodImpDef & CardDef & MinionDef>) {
//         const superProps = MinionModel.minionProps(props);
//         super({
//             ...superProps,
//             stateDict: {},
//             paramDict: {
//                 races: [ RaceType.Demon ],
//                 name: 'Blood Imp',
//                 desc: 'At the end of your turn, give another random friendly minion +1 Health.'
//             },
//             childDict: {
//                 effectBloodImp: { code: 'effect-blood-imp' },
//                 ...superProps.childDict
//             }
//         });
//     }
// }

// export type EffectBloodImpDef = Def.Create<{
//     code: 'effect-blood-imp',
//     parent: BloodImpModel
// }>

// @Factory.useProduct('effect-blood-imp')
// export class EffectBloodImpModel extends FeatureModel<EffectBloodImpDef> {
//     constructor(props: Props<EffectBloodImpDef & FeatureDef>) {
//         super({
//             ...props,
//             paramDict: {
//                 name: 'Blood Imp\'s End Turn Effect',
//                 desc: 'Give another random friendly minion +1 Health.'
//             },
//             stateDict: {},
//             childDict: {}
//         });
//     }

//     @Lifecycle.useLoader()
//     private _handleRoundEnd() {
//         this.bindEvent(
//             GameModel.core.eventEmitterDict.onRoundEnd,
//             () => {
//                 if (!this.minion) return;
//                 const board = this.minion.player.childDict.board;
//                 const minionList = board.getMinionList({
//                     excludeTarget: this.minion
//                 });
//                 if (minionList.length) {
//                     const index = Random.number(0, minionList.length - 1);
//                     const target = minionList[index];
//                     if (target instanceof MinionModel) {
//                         const chunk: Chunk<BuffBloodImpDef> = {
//                             code: 'buff-blood-imp'
//                         };
//                         target.childDict.featureList.addFeature(chunk);
//                     }
//                 }
//             }
//         );
//     }
// } 


// export type BuffBloodImpDef = Def.Create<{
//     code: 'buff-blood-imp',
// }> 

// @Factory.useProduct('buff-blood-imp')
// export class BuffBloodImpModel extends BuffModel<BuffBloodImpDef> {
//     constructor(props: Props<BuffBloodImpDef & BuffDef & FeatureDef>) {
//         super({
//             ...props,
//             paramDict: {
//                 name: 'Blood Imp\'s Buff',
//                 desc: 'Give a minion +1 Health this turn.',
//                 modAttack: 0,
//                 modHealth: 1
//             },
//             stateDict: {},
//             childDict: {}
//         });
//     }
// }

