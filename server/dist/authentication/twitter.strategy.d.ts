import { VerifyCallback } from 'passport-twitter';
declare const TwitterStrategy_base: new (...args: any[]) => any;
export declare class TwitterStrategy extends TwitterStrategy_base {
    constructor();
    validate(accessToken: string, secretToken: string, profile: any, done: VerifyCallback): Promise<any>;
}
export {};
