import { Injectable } from '@angular/core';

export interface TargetWindow extends Window {
  adobe: any,
  mboxCreate: Function,
  mboxDefine: Function,
  mboxUpdate: Function,
  targetGlobalSettings?: any,
  targetPageParams?: Function,
  targetPageParamsAll?: Function,
}

interface Opts {
  mbox?: string,
  timeout?: number,
  params?: { [key: string]: string; },
  selector?: any
}

export interface TargetOpts extends Opts {
  success: Function,
  error?: Function
}

const win = window as TargetWindow;

@Injectable()
export class TargetService {
  getOffer(opts: Opts) {
    return new Promise((resolve, reject) => {
      opts = opts || {};
      if (!opts.mbox) {
        reject('Mbox name not specified!');
      }
      const atOpts: TargetOpts = {
        mbox: opts.mbox,
        params: opts.params,
        timeout: opts.timeout,
        success: (response) => {
          if (response && response.length > 0) {
            resolve({
              mbox: opts.mbox,
              offer: response,
              selector: opts.selector
            });
          } else {
            reject('Empty offer');
          }
        },
        error: (status, error) => {
          reject(error);
        }
      };
      win.adobe.target.getOffer(atOpts);
    });
  }

  applyOffer(offer) {
    return new Promise((resolve, reject) => {
      win.adobe.target.applyOffer(offer);
      resolve();
    });
  }
}
