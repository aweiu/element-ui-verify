import { RuleGetter } from "./types";
export type RuleGetters = { [name: string]: RuleGetter };
const getters: RuleGetters = {};
function rules(): RuleGetters;
function rules(name: string, getter?: RuleGetter): RuleGetter;
function rules(name?: string, getter?: RuleGetter): any {
  if (!name) return getters;
  if (getters[name] && getter)
    throw Error(`the rule name '${name}' has been used`);
  if (getter) getters[name] = getter;
  return getters[name];
}
export default rules;
