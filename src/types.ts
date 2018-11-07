export type RuleGetter = (ruleVal?: any) => object
export type ErrorMessageTemplate = {
  empty: string,
  length: string,
  minLength: string,
  number: string,
  int: string,
  lt: string,
  lte: string,
  gt: string,
  gte: string,
  maxDecimalLength: string,
  phone: string,
  email: string,
  verifyCode: string,
  idCard:string,
  [name: string]: string
}
