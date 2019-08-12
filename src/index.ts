import rules from "./rules";
import Component from "./component";
import errorMessage from "./error-message";
import defaultErrorMessageTemplate from "./error-message-template";
import { VueConstructor } from "vue";
import { PropOptions } from "vue/types/options";
import { RuleGetter, ErrorMessageTemplate } from "./types";

export interface VerifyRulePropOptions extends PropOptions {
  name: string;
}

let ElFormItemComponent: VueConstructor;

function addRule(
  name: string | VerifyRulePropOptions,
  getter: RuleGetter
): RuleGetter {
  if (!ElFormItemComponent) throw Error("please install me");
  const props: any = {};
  if (typeof name === "string") props[name] = {};
  else props[name.name] = name;
  const _name = typeof name === "string" ? name : name.name;
  const component: any = { props };
  // 监听prop变化，触发校验
  component.watch = {};
  component.watch[_name] = function() {
    if (this.verify !== undefined && (this as any).prop)
      (this as any).validate("");
  };
  ElFormItemComponent.mixin(component);
  return rules(_name, getter);
}

function getRule(name: string): RuleGetter {
  return rules(name);
}

function getErrorMessage(name: string, templateData?: any): string {
  return errorMessage.get(name, templateData);
}

function init() {
  const transform = (value: string) => Number(value);
  // 文本长度
  addRule({ name: "length", type: Number }, length => ({
    len: length,
    message: getErrorMessage("length", length)
  }));
  // 最小文本长度
  addRule({ name: "minLength", type: Number }, minLength => ({
    min: minLength,
    message: getErrorMessage("minLength", minLength)
  }));
  // 数字
  addRule("number", () => ({
    validator(rule: any, val: string, callback: Function) {
      if (/^([-+])?\d+(\.\d+)?$/.test(val)) callback();
      else callback(Error(getErrorMessage("number")));
    }
  }));
  // gt
  addRule({ name: "gt", type: Number }, gt => [
    getRule("number")(),
    {
      validator(rule: any, val: number, callback: Function) {
        if (val > gt) callback();
        else callback(Error(getErrorMessage("gt", gt)));
      }
    }
  ]);
  // gte
  addRule({ name: "gte", type: Number }, gte => [
    getRule("number")(),
    {
      type: "number",
      min: gte,
      transform,
      message: getErrorMessage("gte", gte)
    }
  ]);
  // lt
  addRule({ name: "lt", type: Number }, lt => [
    getRule("number")(),
    {
      validator(rule: any, val: number, callback: Function) {
        if (val < lt) callback();
        else callback(Error(getErrorMessage("lt", lt)));
      }
    }
  ]);
  // lte
  addRule({ name: "lte", type: Number }, lte => [
    getRule("number")(),
    {
      type: "number",
      max: lte,
      transform,
      message: getErrorMessage("lte", lte)
    }
  ]);
  // 整数类型
  addRule("int", () => [
    getRule("number")(),
    {
      type: "integer",
      transform,
      message: getErrorMessage("int")
    }
  ]);
  // 最多小数位
  addRule({ name: "maxDecimalLength", type: Number }, maxDecimalLength => [
    getRule("number")(),
    {
      validator(rule: any, val: string | number, callback: Function) {
        const decimal = val.toString().split(".")[1];
        if (decimal && decimal.length > maxDecimalLength)
          callback(
            Error(getErrorMessage("maxDecimalLength", maxDecimalLength))
          );
        else callback();
      }
    }
  ]);
  // 手机号 https://github.com/aweiu/element-ui-verify/issues/24
  addRule("phone", () => ({
    pattern: /^(?=\d{11}$)^1(?:3\d|4[57]|5[^4\D]|6[67]|7[^249\D]|8\d|9[189])\d{8}$/,
    message: getErrorMessage("phone")
  }));
  // 邮箱
  addRule("email", () => ({
    type: "email",
    message: getErrorMessage("email")
  }));
  // 6位数字验证码
  addRule("verifyCode", () => ({
    pattern: /^\d{6}$/,
    message: getErrorMessage("verifyCode")
  }));
}

function install(
  Vue: VueConstructor<any>,
  options: {
    errorMessageTemplate?: ErrorMessageTemplate;
    fieldChange?: "clear" | "verify";
  } = {}
) {
  ElFormItemComponent = Vue.component("ElFormItem");
  if (!ElFormItemComponent) throw Error("please install element-ui first");
  errorMessage.setTemplate(
    options.errorMessageTemplate || defaultErrorMessageTemplate
  );
  Component.fieldChange = options.fieldChange || "verify";
  ElFormItemComponent.mixin(Component);
  init();
}

export default {
  install,
  addRule,
  getRule,
  getErrorMessage
};
