# element-ui-verify
如果你受够了饿了么ElementUI原生的校验方式，那就来试试它吧！

## 前言
饿了么ElementUI虽好，但表单校验的体验不够理想

如果说产品开发要讲究用户体验，那插件开发也要讲究开发体验，而好的开发体验，要靠好的api设计来保障

本人专注校验插件开发30年，有祖传的校验插件api设计（玩笑）。主要是参考了之前写的[vue-verify-pop](https://github.com/aweiu/vue-verify-pop)的api，并加以完善，取值精华，去其糟粕，揉和日月之精华。。。

本插件只是对ElementUI原本的校验方式做了一层封装，核心的校验器仍然是[async-validator](https://github.com/yiminghe/async-validator)，非侵入式，完全不会影响你继续使用ElementUI的原生校验

## 安装
```
npm install element-ui-verify
```
## 使用
### 环境
`VUE版本：2.x`
`webpack模块环境`
### 一，安装
```
import Vue from 'vue'
import elementUI from 'element-ui'
import elementUIVerify from 'element-ui-verify'

// 这里注意必须得先use elementUI
Vue.use(elementUI)
Vue.use(elementUIVerify)
```
### 二，在el-form-item上配置校验规则
```
<template>
  <el-form :model="model">
    <el-form-item prop="age" verify number>
      <el-input v-model.number="model.age"></el-input>
    </el-form-item>
  </el-form>
</template>
<script>
export default{
  data () {
    return {
      model: {
        age: ''
      }
    }
  }
}
</script>
```
ok，您已经完成了一个内容不能为空且为数字的基础校验！([欢迎对比官方版的相似例子](http://element-cn.eleme.io/#/zh-CN/component/form#shu-zi-lei-xing-yan-zheng))


## 默认支持的校验规则
* length: 校验文本长度
* minLength: 校验文本最短长度
* gt: 校验数字要大于某数
* gte: 校验数字要大于等于某数
* lt: 校验数字要小于某数
* lte: 校验数字要小于等于某数
* maxDecimalLength: 校验数字最大小数位
* number: 校验是否为数字
* int: 校验是否为整数
* phone: 校验是否为手机号（随着号段的增加，未来可能需要更新）
* email: 校验是否为电子邮件地址
* verifyCode: 校验是否为6位数字验证码

## 配置
### errorMessageTemplate
错误提示模板。默认值：[默认模板](#插件的默认校验不通过提示模版)

如要使用自定义模板，模板内容要覆盖[默认模板](#插件的默认校验不通过提示模版)中定义的所有字段，否则[getErrorMessage](#geterrormessage-name-string-templatedata-any-string)在获取不到值的时候会抛异常

### fieldChange
当绑定字段变化时，插件的默认行为。默认值：'verify'
> 注意：在输入框失去焦点时会始终触发校验

#### verify
当绑定字段变化时会实时触发校验 

#### clear
当绑定字段变化时只清空校验结果，不触发校验
```
Vue.use(elementUIVerify, {
  errorMessageTemplate: yourErrorMessageTemplate,
  fieldChange: 'clear'
})
```
## 重要选项说明
### verify
若要使用本插件，verify选项是必须的，换句话说，如果没有配置该选项，那么您仍然可以正常使用ElementUI原生的校验

该选项还可以接收一个函数值，用于[自定义校验方法](#自定义校验方法)
### errorMessage
用于自定义校验不通过提示(`空检测和自定义校验方法的错误提示不受该值影响`)
```
<el-form-item prop="numberProp" verify number error-message="请输入正确的数字"></el-form-item>
```
### canBeEmpty
> 插件默认开启输入内容不为空校验，如果开启该选项，一旦该输入项为空则会忽略该输入项之后所有的校验

该选项一般用于如下情况，比如邀请码这种一般可以为空，不为空又需要校验的输入项

```
<!--当邀请码不为空时才校验长度是否等于6-->
<el-form-item prop="invitationCode" verify can-be-empty :length="6" error-message="邀请码不正确"></el-form-item>
```
### space
插件执行空检测时默认忽略空格，也就是说某个输入框中如果只输入了空格是过不了空检测的，除非设置该选项
```
<el-form-item prop="test" verify space></el-form-item>
```
### alias
`插件保留Macro`

懒人的福音，用于复用错误提示，默认值："该输入项"。使用场景：

假设你的空检测错误提示模板为：
```
{empty: '{alias}不能为空'}
```
表单内容为：
```
<el-form-item prop="unknown" verify></el-form-item>
<el-form-item alias="姓名" prop="name" verify></el-form-item>
<el-form-item label="地址" prop="address" verify></el-form-item>
```
* 当`unknown`输入框为空时，会提示"该输入项不能为空"（alias值默认为"该输入项"）
* 当`姓名`输入框为空时，会提示"姓名不能为空"（显式设置了alias值时，提示内容自然会以该值去替换模板)
* 当`地址`输入框为空时，会提示"地址不能为空"（大部分el-form-item都需要设置一个label项，而label项往往就代表该输入项的alias，因此插件会取该值直接作为alias，很贴心有木有）
### fieldChange
参见全局[fieldChange](#fieldchange)配置

### watch
监听其他变量，触发自身校验

一个常见例子：密码一致性校验，pass1的变化会触发pass2的校验([欢迎对比官方版的相似例子](http://element.eleme.io/#/zh-CN/component/form#zi-ding-yi-xiao-yan-gui-ze))
```
<template>
  <el-form :model="model">
    <el-form-item label="密码" prop="pass1" verify>
      <el-input v-model="model.pass1"></el-input>
    </el-form-item>
    <el-form-item label="确认密码" prop="pass2" :verify="verifyPassword" :watch="model.pass1">
      <el-input v-model="model.pass2"></el-input>
    </el-form-item>
  </el-form>
</template>
<script>
export default{
  data () {
    return {
      model: {
        pass1: '',
        pass2: ''
      }
    }
  },
  methods: {
    verifyPassword (rule, val, callback) {
      if (val !== this.model.pass1) callback(Error('两次输入密码不一致!'))
      else callback()
    }
  }
}
</script>
```

再举一个不适合使用该选项的场景，比如下面这个最少最多人数的例子，最少人数变化要触发最多人数的校验：
```
<template>
  <el-form :model="model">
    <el-form-item label="最少参与人数" prop="minNumber" verify int :gt="0">
      <el-input v-model.number="model.minNumber"></el-input>
    </el-form-item>
    <el-form-item label="最多参与人数" prop="maxNumber" verify int :gt="model.minNumber" :watch="minNumber">
      <el-input v-model.number="model.maxNumber"></el-input>
    </el-form-item>
  </el-form>
</template>
```
其实watch选项在这里完全没必要，因为`插件会响应所有校验参数的变化来触发自身校验`，最多参与人数的`gt`值引用了`model.minNumber`，一旦`model.minNumber`变化，就会触发校验

如果你再watch一下，反而会多触发一次。所以这样即可:
```
<el-form-item label="最多参与人数" prop="maxNumber" verify int :gt="model.minNumber"></el-form-item>
```
### 注意事项
* 所有选项调用不能有大写字母，用中划线分隔，同vue props属性设置规则
* length,minLength,gt,gte,lt,lte,maxDecimalLength等需要接收数值的选项，该值需为数字(`:length="1"`)
* verify,canBeEmpty,space,number,int等无须接收值的选项一旦设置了，可以通过赋值为`undefined`来取消

## 规则简写
number,int,phone等无须设定值的选项可以直接：
```
<el-form-item prop="prop" verify number></el-form-item>
<!--不用这么写-->
<el-form-item prop="prop" verify :number="true"></el-form-item>
```
gt,gte,lt,lte,maxDecimalLength等数字规则无须再写number规则
```
<!--该输入项内容必须为不大于10的数字-->
<el-form-item prop="prop" verify :lte="10"></el-form-item>
<!--不用这么写-->
<el-form-item prop="prop" verify number :lte="10"></el-form-item>
```
## 全局API
### addRule (name: string | VerifyRulePropOptions, getter: RuleGetter): RuleGetter
用于[自定义校验规则](#自定义校验规则)

#### `name`: 规则名称
本插件的校验选项基于Vue组件的[Prop](https://cn.vuejs.org/v2/guide/components.html#Prop)，故该参数可以是一个类似VueProp的配置项：
```
{
  name: 'length',
  type: Number,
  validator (v) {
     return v > 0
  }
}
```
这么做的好处是可以对规则接收值本身也做一些限制，提前规避一些不必要的调用错误，比如：
```
<el-form-item prop="prop" verify length="哈哈哈"></el-form-item>
```
上述这种情况，就很有可能使你的校验文本长度规则出现异常。当然了，如果您对调用者比较相信或者是那种无须接收值的规则，也可以省事点直接这样：
```
import elementUIVerify from 'element-ui-verify'
elementUIVerify.addRule('length', length => SomeRule)
```
#### `getter`: asyncValidatorRule获取方法
该回调可以返回单条规则或规则数组，具体规则需要参见[async-validator](https://github.com/yiminghe/async-validator)
```
// 单条
() => ({type: 'number', message: '请输入数字'})
// 多条
gte => [
  {type: 'number', message: '请输入数字'},
  {type: 'number', min: gte, message: `该数字不能小于${gte}`}
]
```
如果对上述示例中多条规则重复定义了`type`有疑问的同学，可以看[这里](#其他)

### getRule (name: string): RuleGetter
用于获取校验规则。一般是和[自定义校验规则](#自定义校验规则)搭配使用，方便已有规则的复用

返回内容即为[addRule](#addrule-name-string--verifyrulepropoptions-getter-rulegetter-rulegetter)传入的`getter`参数

### getErrorMessage (name: string, templateData?: any): string
用于从通用错误提示模板中获取错误提示。一般是和[自定义校验规则](#自定义校验规则)搭配使用

假设错误提示模板为
```
{
  // 没有Macro
  empty: '该输入项内容不能为空',
  // Macro正好等于RuleName
  length: '该输入项内容长度需要等于{length}',
  // Macro不等于RuleName
  maxDecimalLength: '该输入项最多接受{MDL}位小数'
}
```
调用示例：
```
import elementUIVerify from 'element-ui-verify'
// 返回："该输入项内容不能为空"
elementUIVerify.getErrorMessage('empty')
// 返回："该输入项内容长度需要等于10"
elementUIVerify.getErrorMessage('length', 10)
// 返回："该输入项最多接受2位小数"
elementUIVerify.getErrorMessage('maxDecimalLength', {MDL: 2})
```

## 自定义校验方法
如果自带的校验规则满足不了您的需求，可以在校验规则中插入您自己的[校验方法](https://github.com/yiminghe/async-validator#validator)

> 自定义校验方法在校验规则都通过后才会执行
```
<template>
  <el-form :model="model">
    <el-form-item label="卡号" prop="cardNumber" :verify="verifyCardNumber" :length="6">
      <el-input v-model.number="model.cardNumber"></el-input>
    </el-form-item>
  </el-form>
</template>
<script>
export default{
  data () {
    return {
      model: {
        cardNumber: ''
      }
    }
  },
  methods: {
    // callback形式
    // 校验是否是010，011开头的卡号
    verifyCardNumber (rule, val, callback) {
      // rule: 这个参数很恶心，不经常用到还要放在第一位，不过为了保持async-validator的风格，还是留着它了
      // val: 待校验值
      // callback: 校验结果回调 具体可以点击上文的"校验方法"链接查看
      if (!['010', '011'].includes(val.substr(0, 3))) callback(Error('错误的卡号'))
      else callback()
    }
  }
}
</script>
```
## 自定义校验规则
和自定义校验方法的区别是这个适用于全局，等于增加插件自带的校验规则

前言已经说过，本插件的核心校验器来自async-validator，故校验规则需要您先参考它的[文档](https://github.com/yiminghe/async-validator)

示例1：新增一个校验是否为10位整数的规则
```
import elementUIVerify from 'element-ui-verify'
// 通过getRule方法复用已有的int规则
const intRuleGetter = elementUIVerify.getRule('int')
elementUIVerify.addRule('int10', () => [
  // 首先校验是否为整数
  intRuleGetter(),
  // 再校验是否为10位
  {
    validator (rule, val, callback) {
      if ((val + '').length !== 10) {
        // 尽量将出错提示定义在错误模板中（假设为{int10: '该输入项为10位整数'}）
        const errorMessage = elementUIVerify.getErrorMessage('int10')
        callback(Error(errorMessage))
      } else callback()
    }
  }
])
```
这样就完成了一个简单的规则拓展，您就可以在任何地方像使用默认规则那样来调用您的自定义规则，如下：
```
<el-form-item prop="prop" verify int10></el-form-item>
```
示例2：新增一个校验是否为任意位整数的规则，与上面不同的是该规则需要接收一个规则参数
```
import elementUIVerify from 'element-ui-verify'
const intRuleGetter = elementUIVerify.getRule('int')
// 这里最好不要再直接传入'intLength'了，而是一个类似VueProp的配置项，来对规则参数稍作限制
elementUIVerify.addRule({name: 'intLength', type: Number}, intLength => [
  intRuleGetter(),
  // 校验整数长度是否符合规则
  {
    validator (rule, val, callback) {
      if ((val + '').length !== intLength) {
        // 假设出错模板为{intLength: '该输入项为{intLength}位整数'}
        const errorMessage = elementUIVerify.getErrorMessage('intLength', intLength)
        callback(Error(errorMessage))
      } else callback()
    }
  }
])
```
调用:
```
<el-form-item prop="prop" verify :int-length="10"></el-form-item>
```
更多示例您可以直接翻看本插件[源码](https://github.com/aweiu/element-ui-verify/blob/master/src/index.ts#L52)中默认规则的添加

## 插件的默认校验不通过提示模版
```
{
  empty: '请补充该项内容',
  length: '请输入{length}位字符',
  minLength: '输入内容至少{minLength}位',
  number: '请输入数字',
  int: '请输入整数',
  lt: '输入数字应小于{lt}',
  lte: '输入数字不能大于{lte}',
  gt: '输入数字应大于{gt}',
  gte: '输入数字不能小于{gte}',
  maxDecimalLength: '该输入项最多接受{maxDecimalLength}位小数',
  phone: '请输入正确的手机号',
  email: '请输入正确的邮箱',
  verifyCode: '请输入正确的验证码'
}
```
## 常见问题
**为什么不把prop配置项干掉？每次都要写校验规则都要写它好烦！**

我也烦。但本插件是基于ElementUI的，所以很多地方会受到原始校验机制的限制，还要尽可能不对它产生影响。比如这个prop选项，如果把它干掉，会影响到el-form的校验，因为ElementUI以prop作为uid来存储校验队列

**如何切换校验类型？比如某个输入框可能输入手机号也可能输入邮箱**
```
<el-form-item prop="prop" verify phone v-if="isPhone"></el-form-item>
<el-form-item prop="prop" verify email v-else></el-form-item>
```
在规则变化不多的情况下也可以这样（该种方式切换类型时会立即触发校验）
```
<el-form-item prop="prop" verify :phone="isPhone ? true : undefined" :email="isPhone ? undefined : true"></el-form-item>
```
## 其他
在写`gte`规则的时候，我首先引用了async-validator的数字类型规则，然后再引用了它的[Range规则](https://github.com/yiminghe/async-validator#range)，
而它的Range规则同时支持字符串和数字，所以针对数字的校验需要显式再设置一遍`type: number`，这虽然会导致`gte`规则可能会校验两遍类型是否为数字，不过性能影响不大
```
// 这里的min显然是要校验数字的
[
  {type: 'number'},
  {min: 3}
]
// 然而你必须得写成
[
  {type: 'number'},
  {type: 'number', min: 3}
]
// 当然了你也可以通过写自定义校验函数来规避此问题，不过此问题没这个必要
[
  {type: 'number'},
  {
    validator (rule, val, callback) {
      if (val < 3) callback(Error('不能小于3'))
    }
  }
]
```
也不能算是async-validator的缺点吧，基于它当前的规则约定如果做规则推断的话收益不大，还会增加校验规则的不确定性，给调用者造成困惑。不过只针对本需求的话可以考虑把文本和数字的range规则给分开

这里可能你会问那为什么不直接用单条规则？
```
{type: 'number', min: 3, errorMessage: 'xxxx'}
```
如果这么写了，输入非数字的错误提示会是原始错误提示模板中的内容。为了不破坏ElementUI的原生校验（修改原始错误提示模板）和最大化复用async-validator内置的校验，只得通过拆分规则来让校验错误提示更具体

之后您在自定义校验规则的时候，如遇类似问题也可考虑通过规则拆分来让错误提示更具体
## 后话
由于本插件的校验选项是基于VueProp，有如下缺点：

* 随着ElementUI的更新，未来有可能会和它的某些新增选项产生冲突
* 难以做到按照校验规则的书写顺序来执行校验，目前的大顺序是：空检测 > 通用规则 > 自定义校验方法。不过该条的影响不是很大，现有规则下的大部分场景不需要考虑规则顺序

