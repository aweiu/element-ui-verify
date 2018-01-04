var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import Vue from 'vue';
import { FormItem } from 'element-ui';
import rules from './rules';
import errorMessage from './error-message';
import { Component, Prop, Watch } from 'vue-property-decorator';
// 引用一份，解决某些环境下调用了全局Vue.mixin后再调用原FormItem下的方法会造成调用栈溢出
const ElFormItemMethods = Object.assign({}, FormItem.methods);
let ElFormItemVerifyComponent = ElFormItemVerifyComponent_1 = class ElFormItemVerifyComponent extends Vue {
    // watch某值并修改该值本身会额外触发一次，性能影响不大，暂不做过滤了。后期可能会用其它方式拦截
    onValidateMessageChanged(msg) {
        if (this._verify && msg !== '') {
            const alias = this.alias || this.label || '该输入项';
            this.validateMessage = errorMessage.macroToValue(this.validateMessage, 'alias', alias);
        }
    }
    onWatchChanged() {
        if (this._verify)
            this.validate('');
    }
    get _verify() {
        return this.verify !== undefined && this.prop;
    }
    getRules() {
        if (!this._verify)
            return ElFormItemMethods.getRules.apply(this, arguments);
        // 空检测
        let fieldValue = this.fieldValue + '';
        if (this.space === undefined)
            fieldValue = fieldValue.trim();
        if (fieldValue === '') {
            return [{
                    validator: (rule, val, callback) => {
                        if (this.canBeEmpty !== undefined || this.minLength <= 0)
                            callback();
                        else
                            callback(Error(errorMessage.get('empty')));
                    }
                }];
        }
        // 合并普通规则
        let asyncVerifyRules = [];
        const ruleGetters = rules();
        for (let name in ruleGetters) {
            const ruleVal = this[name];
            if (ruleVal !== undefined)
                asyncVerifyRules = asyncVerifyRules.concat(ruleGetters[name](ruleVal));
        }
        // 统一处理错误提示（代码块放在此处可以只针对普通规则）
        if (this.errorMessage !== undefined) {
            for (let rule of asyncVerifyRules)
                rule.message = this.errorMessage;
        }
        // 自定义校验方法置后
        if (typeof this.verify === 'function')
            asyncVerifyRules.push({ validator: this.verify });
        // 当规则为空时，返回一个始终通过的规则来避免空检测错误无法清除
        // 也可以通过(this as any).clearValidate()的方式实现，不过不太好
        return asyncVerifyRules.length === 0 ? [{
                validator(rule, val, callback) {
                    callback();
                }
            }] : asyncVerifyRules;
    }
    // 兼容<2.0.0-beta.1
    clearValidate() {
        if (ElFormItemMethods.clearValidate) {
            ElFormItemMethods.clearValidate.apply(this, arguments);
        }
        else {
            this.validateState = '';
            this.validateMessage = '';
            this.validateDisabled = false;
        }
    }
    onFieldChange() {
        const fieldChange = this.fieldChange || ElFormItemVerifyComponent_1.fieldChange;
        if (!this._verify || fieldChange !== 'clear')
            ElFormItemMethods.onFieldChange.apply(this, arguments);
        else if (this._verify && fieldChange === 'clear')
            this.clearValidate();
    }
};
__decorate([
    Prop(),
    __metadata("design:type", String)
], ElFormItemVerifyComponent.prototype, "canBeEmpty", void 0);
__decorate([
    Prop([String, Function]),
    __metadata("design:type", Object)
], ElFormItemVerifyComponent.prototype, "verify", void 0);
__decorate([
    Prop(),
    __metadata("design:type", String)
], ElFormItemVerifyComponent.prototype, "space", void 0);
__decorate([
    Prop(),
    __metadata("design:type", String)
], ElFormItemVerifyComponent.prototype, "errorMessage", void 0);
__decorate([
    Prop(),
    __metadata("design:type", String)
], ElFormItemVerifyComponent.prototype, "alias", void 0);
__decorate([
    Prop(),
    __metadata("design:type", void 0)
], ElFormItemVerifyComponent.prototype, "watch", void 0);
__decorate([
    Prop(),
    __metadata("design:type", String)
], ElFormItemVerifyComponent.prototype, "fieldChange", void 0);
__decorate([
    Watch('validateMessage'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ElFormItemVerifyComponent.prototype, "onValidateMessageChanged", null);
__decorate([
    Watch('watch'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ElFormItemVerifyComponent.prototype, "onWatchChanged", null);
ElFormItemVerifyComponent = ElFormItemVerifyComponent_1 = __decorate([
    Component
], ElFormItemVerifyComponent);
export default ElFormItemVerifyComponent;
var ElFormItemVerifyComponent_1;
