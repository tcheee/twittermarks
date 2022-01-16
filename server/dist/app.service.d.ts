export declare class AppService {
    twitterLogin(req: any): "error from twitter" | {
        message: string;
        user: any;
    };
    logUser(user: any): Promise<void>;
    generateTwitterSignatureString(method: string, url: string, url_parameter: string, nonce: string, timestamp: string, appConsumerKey: string, userToken: string): string;
    generateTwitterSigningString(appSecretToken: string, userSecretToken: string): string;
    generateTimestampTwitterServerTime(): number;
    generateNonce(): string;
    generateTwitterSignature(method: string, url: string, parameter: string, nonce: string, timestamp: string, accessToken: any, secretToken: any): string;
    generateTwitterHeader(method: string, url: string, parameter: string, accessToken: any, secretToken: any): string;
    lookupUser(accessToken: string, secretToken: string, username: string): Promise<{
        success: boolean;
        data: any;
        sucess?: undefined;
        error?: undefined;
        time?: undefined;
    } | {
        sucess: boolean;
        data: any;
        error: string;
        success?: undefined;
        time?: undefined;
    } | {
        sucess: boolean;
        data: any;
        error: string;
        time: Date;
        success?: undefined;
    }>;
    getLikes(accessToken: string, secretToken: string, userId: string): Promise<{
        success: boolean;
        error: string;
        time: Date;
        data: any[];
    } | {
        success: boolean;
        data: any[];
        error?: undefined;
        time?: undefined;
    }>;
}
