import rules from './rules'
import Component from './component'
import errorMessage from './error-message'
import defaultErrorMessageTemplate from './error-message-template'
import { VueConstructor } from 'vue'
import { PropOptions } from 'vue/types/options'
import { RuleGetter, ErrorMessageTemplate } from './types'

export interface VerifyRulePropOptions extends PropOptions {
  name: string
}

let installed = false
let ElFormItemComponent: VueConstructor
const exp = {
  install (Vue: VueConstructor<any>, options: { errorMessageTemplate?: ErrorMessageTemplate, fieldChange?: 'clear' | 'verify' } = {}) {
    if (installed) return
    installed = true
    ElFormItemComponent = Vue.component('ElFormItem')
    if (!ElFormItemComponent) throw Error('please install element-ui first')
    errorMessage.setTemplate(options.errorMessageTemplate || defaultErrorMessageTemplate)
    Component.fieldChange = options.fieldChange || 'verify'
    ElFormItemComponent.mixin(Component)
    init()
  },
  addRule (
    name: string | VerifyRulePropOptions,
    getter: RuleGetter
  ): RuleGetter {
    if (!installed) throw Error('please install me')
    const props: any = {}
    if (typeof name === 'string') props[name] = {}
    else props[name.name] = name
    const _name = typeof name === 'string' ? name : name.name
    const component: any = { props }
    // 监听prop变化，触发校验
    component.watch = {}
    component.watch[_name] = function () {
      if (this.verify !== undefined && (this as any).prop) (this as any).validate('')
    }
    ElFormItemComponent.mixin(component)
    return rules(_name, getter)
  },
  getRule (name: string): RuleGetter {
    return rules(name)
  },
  getErrorMessage (name: string, templateData?: any): string {
    return errorMessage.get(name, templateData)
  }
}

function init () {
  // 文本长度
  exp.addRule({ name: 'length', type: Number }, length => ({
    len: length,
    message: exp.getErrorMessage('length', length)
  }))
  // 最小文本长度
  exp.addRule({ name: 'minLength', type: Number }, minLength => ({
    min: minLength,
    message: exp.getErrorMessage('minLength', minLength)
  }))
  // 数字类型
  exp.addRule('number', () => ({ type: 'number', message: exp.getErrorMessage('number') }))
  // gt
  exp.addRule({ name: 'gt', type: Number }, gt => [
    exp.getRule('number')(),
    {
      validator (rule: any, val: number, callback: Function) {
        if (val <= gt) callback(Error(exp.getErrorMessage('gt', gt)))
        else callback()
      }
    }
  ])
  // gte
  exp.addRule({ name: 'gte', type: Number }, gte => [
    exp.getRule('number')(),
    { type: 'number', min: gte, message: exp.getErrorMessage('gte', gte) }
  ])
  // lt
  exp.addRule({ name: 'lt', type: Number }, lt => [
    exp.getRule('number')(),
    {
      validator (rule: any, val: number, callback: Function) {
        if (val >= lt) callback(Error(exp.getErrorMessage('lt', lt)))
        else callback()
      }
    }
  ])
  // lte
  exp.addRule({ name: 'lte', type: Number }, lte => [
    exp.getRule('number')(),
    { type: 'number', max: lte, message: exp.getErrorMessage('lte', lte) }
  ])
  // 整数类型
  exp.addRule('int', () => ({ type: 'integer', message: exp.getErrorMessage('int') }))
  // 最多小数位
  exp.addRule(
    { name: 'maxDecimalLength', type: Number },
    maxDecimalLength => [
      exp.getRule('number')(),
      {
        validator (rule: any, val: number, callback: Function) {
          const decimal = val.toString().split('.')[1]
          if (decimal && decimal.length > maxDecimalLength) callback(Error(exp.getErrorMessage('maxDecimalLength', maxDecimalLength)))
          else callback()
        }
      }
    ]
  )
  // 手机号
  exp.addRule('phone', () => ({
    pattern: /^((1[3-9][0-9])+\d{8})$/,
    message: exp.getErrorMessage('phone')
  }))
  // 邮箱
  exp.addRule('email', () => ({ type: 'email', message: exp.getErrorMessage('email') }))
  // 6位数字验证码
  exp.addRule('verifyCode', () => ({
    pattern: /^\d{6}$/,
    message: exp.getErrorMessage('verifyCode')
  }))
   // 6位数字验证码
   exp.addRule('idCard', () => ({
    pattern:  /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}[0-9Xx]$)/,
    message: exp.getErrorMessage('idCard')
  }))
}

export default exp
