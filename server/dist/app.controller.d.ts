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
    } | {
        sucess: boolean;
        data: string;
        success?: undefined;
    }>;
    getLikes(body: any): Promise<any[]>;
}
