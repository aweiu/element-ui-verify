import { ErrorMessageTemplate } from './types';
declare const _default: {
    setTemplate(errorMessageTemplate: ErrorMessageTemplate): void;
    macroToValue(msg: string, macro: string, value: any): string;
    get(name: string, templateData?: any): string;
};
export default _default;
