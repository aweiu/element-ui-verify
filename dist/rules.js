const getters = {};
function rules(name, getter) {
    if (!name)
        return getters;
    if (getters[name] && getter)
        throw Error(`the rule name '${name}' has been used`);
    if (getter)
        getters[name] = getter;
    return getters[name];
}
export default rules;
