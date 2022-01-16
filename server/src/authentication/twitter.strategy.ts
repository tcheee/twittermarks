import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-twitter';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TwitterStrategy extends PassportStrategy(Strategy, 'twitter') {
  constructor() {
    super({
      consumerKey: process.env.APP_ACCESS_TOKEN,
      consumerSecret: process.env.APP_SECRET_TOKEN,
      callbackURL: process.env.URL + 'api/auth/twitter/callback',
      proxy: true,
    });
  }

  async validate(
    accessToken: string,
    secretToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    profile.accessToken = accessToken;
    profile.secretToken = secretToken;
    done(null, profile);
  }
}
