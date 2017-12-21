import { ErrorMessageTemplate } from './types'

let template: ErrorMessageTemplate
type MacroMap = { [macro: string]: string }

function createMacroMap (macro: string, value: any): MacroMap {
  const obj: any = {}
  obj[macro] = value
  return obj
}

export default {
  setTemplate (errorMessageTemplate: ErrorMessageTemplate) {
    template = errorMessageTemplate
  },
  macroToValue (msg: string, macro: string, value: any): string {
    const reg = new RegExp(`{${macro}}`, 'g')
    return msg.replace(reg, value)
  },
  get (name: string, templateData?: any): string {
    let msg = template[name]
    if (!msg) return 'invalid value'
    if (arguments.length === 1) return msg
    if (typeof templateData !== 'object') templateData = createMacroMap(name, templateData)
    for (let macro in templateData) msg = this.macroToValue(msg, macro, templateData[macro])
    return msg
  }
}
