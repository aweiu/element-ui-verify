import Vue from 'vue';
export default class ElFormItemVerifyComponent extends Vue {
    static fieldChange: 'verify' | 'clear';
    canBeEmpty?: string;
    verify?: string | Function;
    space?: string;
    errorMessage?: string;
    alias?: string;
    watch: undefined;
    fieldChange: string;
    onValidateMessageChanged(msg: string): void;
    onWatchChanged(): void;
    readonly _verify: boolean;
    getRules(): object[];
    clearValidate(): void;
    onFieldChange(): void;
}
