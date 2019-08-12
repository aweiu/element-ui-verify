import { VueConstructor } from "vue";
import { PropOptions } from "vue/types/options";
import { RuleGetter, ErrorMessageTemplate } from "./types";
export interface VerifyRulePropOptions extends PropOptions {
    name: string;
}
declare function addRule(name: string | VerifyRulePropOptions, getter: RuleGetter): RuleGetter;
declare function getRule(name: string): RuleGetter;
declare function getErrorMessage(name: string, templateData?: any): string;
declare function install(Vue: VueConstructor<any>, options?: {
    errorMessageTemplate?: ErrorMessageTemplate;
    fieldChange?: "clear" | "verify";
}): void;
declare const _default: {
    install: typeof install;
    addRule: typeof addRule;
    getRule: typeof getRule;
    getErrorMessage: typeof getErrorMessage;
};
export default _default;
