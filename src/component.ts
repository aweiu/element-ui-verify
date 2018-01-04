import Vue from 'vue'
import elementUI from 'element-ui'
import rules from './rules'
import errorMessage from './error-message'
import { Component, Prop, Watch } from 'vue-property-decorator'

@Component
export default class ElFormItemVerifyComponent extends Vue {
  static fieldChange: 'verify' | 'clear'
  @Prop()
  canBeEmpty?: string
  @Prop([String, Function])
  verify?: string | Function
  @Prop()
  space?: string
  @Prop()
  errorMessage?: string
  @Prop()
  alias?: string
  @Prop()
  watch: undefined
  @Prop()
  fieldChange: string

  // watch某值并修改该值本身会额外触发一次，性能影响不大，暂不做过滤了。后期可能会用其它方式拦截
  @Watch('validateMessage')
  onValidateMessageChanged (msg: string) {
    if (this._verify && msg !== '') {
      const alias = this.alias || (this as any).label || '该输入项';
      (this as any).validateMessage = errorMessage.macroToValue((this as any).validateMessage, 'alias', alias)
    }
  }

  @Watch('watch')
  onWatchChanged () {
    if (this._verify) (this as any).validate('')
  }

  get _verify (): boolean {
    return this.verify !== undefined && (this as any).prop
  }

  cacheElementUIGetRules (...arg: any[]) {
    return (elementUI.FormItem as any).methods.getRules.bind(this, ...arg)
  }

  getRules (...arg: any[]): object[] {
    if (!this._verify) return this.cacheElementUIGetRules(...arg)
    // 空检测
    let fieldValue = (this as any).fieldValue + ''
    if (this.space === undefined) fieldValue = fieldValue.trim()
    if (fieldValue === '') {
      return [{
        validator: (rule: any, val: any, callback: Function) => {
          if (this.canBeEmpty !== undefined || (this as any).minLength <= 0) callback()
          else callback(Error(errorMessage.get('empty')))
        }
      }]
    }
    // 合并普通规则
    let asyncVerifyRules: object[] = []
    const ruleGetters = rules()
    for (let name in ruleGetters) {
      const ruleVal = (this as any)[name]
      if (ruleVal !== undefined) asyncVerifyRules = asyncVerifyRules.concat(ruleGetters[name](ruleVal))
    }
    // 统一处理错误提示（代码块放在此处可以只针对普通规则）
    if (this.errorMessage !== undefined) {
      for (let rule of asyncVerifyRules) (rule as any).message = this.errorMessage
    }
    // 自定义校验方法置后
    if (typeof this.verify === 'function') asyncVerifyRules.push({ validator: this.verify })
    // 当规则为空时，返回一个始终通过的规则来避免空检测错误无法清除
    // 也可以通过(this as any).clearValidate()的方式实现，不过不太好
    return asyncVerifyRules.length === 0 ? [{
      validator (rule: any, val: any, callback: Function) {
        callback()
      }
    }] : asyncVerifyRules
  }

  cacheElementUIClearValidate (...arg: any[]) {
    return (elementUI.FormItem as any).methods.clearValidate.bind(this, ...arg)
  }

  // 兼容<2.0.0-beta.1
  clearValidate (...arg: any[]) {
    this.cacheElementUIClearValidate && this.cacheElementUIClearValidate(...arg);
    (this as any).validateState = '';
    (this as any).validateMessage = '';
    (this as any).validateDisabled = false
  }

  cacheElementUIOnFieldChange (...arg: any[]) {
    return (elementUI.FormItem as any).methods.onFieldChange.bind(this, ...arg)
  }

  onFieldChange (...arg: any[]) {
    const fieldChange = this.fieldChange || ElFormItemVerifyComponent.fieldChange
    if (!this._verify || fieldChange !== 'clear') this.cacheElementUIOnFieldChange(...arg)
    else if (this._verify && fieldChange === 'clear') this.clearValidate()
  }
}
