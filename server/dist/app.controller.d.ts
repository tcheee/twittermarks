import { AppService } from './app.service';
import { Response } from 'express';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    twitterAuth(): void;
    twitterAuthRedirect(req: any, response: Response): void;
    lookupUser(body: any): Promise<{
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
    getLikes(body: any): Promise<{
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
