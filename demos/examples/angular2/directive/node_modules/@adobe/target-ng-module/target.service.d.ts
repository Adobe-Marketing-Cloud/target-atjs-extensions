export interface TargetWindow extends Window {
    adobe: any;
    mboxCreate: Function;
    mboxDefine: Function;
    mboxUpdate: Function;
    targetGlobalSettings?: any;
    targetPageParams?: Function;
    targetPageParamsAll?: Function;
}
export interface Opts {
    mbox?: string;
    timeout?: number;
    params?: {
        [key: string]: string;
    };
    selector?: any;
}
export interface TargetOpts extends Opts {
    success: Function;
    error?: Function;
}
export declare class TargetService {
    getOffer(opts: Opts): Promise<{}>;
    applyOffer(offer: any): Promise<{}>;
}
