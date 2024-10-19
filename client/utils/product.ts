import { Model } from "../models";
import { FactoryService } from "../services/factory";
import { ModelConfig } from "../type/model/config";
import { ModelDef } from "../type/model/define";

export function useProduct<M extends ModelDef>(key: ModelDef.Code<M>) {
    return function (
        target: new (config: ModelConfig<M>) => Model<M>
    ) {
        FactoryService.register(key, target);
    };
}