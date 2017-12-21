import { RuleGetter } from './types';
export declare type RuleGetters = {
    [name: string]: RuleGetter;
};
declare function rules(): RuleGetters;
declare function rules(name: string, getter?: RuleGetter): RuleGetter;
export default rules;
