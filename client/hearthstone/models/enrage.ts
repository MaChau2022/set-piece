import { Def, LifecycleService, Model, Props, ValidatorService } from "@/set-piece";
import { FeatureDef, FeatureModel } from "./feature";
import { CombativeModel } from "./combative";
import { Mutable } from "utility-types";

export type EnrageDef<
    T extends Partial<Def> = Def
> = FeatureDef<{
    code: `${string}-enrage-feature`;
    stateDict: {
        isEnraged: boolean;
    }
} & T>;

export abstract class EnrageModel<
    T extends EnrageDef = EnrageDef
> extends FeatureModel<T> {
    static enrageProps<T extends EnrageDef>(props: Props<T>) {
        return FeatureModel.featureProps(props);
    }

    protected abstract handleEnrage(
        target: CombativeModel,
        param: Mutable<Model.ParamDict<CombativeModel>>
    ): void;

    @LifecycleService.useLoader()
    @ValidatorService.useCondition(model => Boolean(model.referDict.board))
    private _listenEnrage() {
        const minion = this.referDict.minion;
        const combative = minion?.childDict.combative;
        if (!minion || !combative) return;

        this.bindEvent(
            combative.eventEmitterDict.onStateAlter,
            () => {
                const isDamaged = 
                    combative.stateDict.curHealth < combative.stateDict.maxHealth;
                if (isDamaged && !this.stateDict.isEnraged) {
                    this.baseStateDict.isEnraged = true;
                    this.bindEvent(
                        combative.eventEmitterDict.onParamCheck,
                        this.handleEnrage
                    );
                } else if (!isDamaged && this.stateDict.isEnraged) {
                    this.baseStateDict.isEnraged = false;
                    this.unbindEvent(
                        combative.eventEmitterDict.onParamCheck,
                        this.handleEnrage
                    );
                }
            }
        );
    }
}