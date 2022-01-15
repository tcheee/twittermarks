import {
  Controller,
  Get,
  Post,
  UseGuards,
  Req,
  Res,
  Param,
  Body,
} from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';

@Controller('/api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/twitterSignIn')
  @UseGuards(AuthGuard('twitter'))
  twitterAuth() {}

  @Get('/auth/twitter/callback')
  @UseGuards(AuthGuard('twitter'))
  twitterAuthRedirect(
    @Req() req,
    @Res({ passthrough: true }) response: Response,
  ) {
    this.appService.logUser(req.user._json);
    // send in a spreadsheet directly
    response.cookie('username', req.user.username);
    response.cookie('image', req.user.photos[0].value || null);
    response.cookie('accessToken', req.user.accessToken);
    response.cookie('secretToken', req.user.secretToken);
    response.redirect(
      process.env.ENVIRONMENT === 'DEVELOPMENT'
        ? 'http://localhost:3000' //+ req.get('host') + '/'
        : 'https://' + req.get('host') + '/',
    );
  }

  @Post('/search')
  lookupUser(@Body() body) {
    const { accessToken, secretToken, username } = body;
    return this.appService.lookupUser(accessToken, secretToken, username);
  }

  @Post('/getLikes')
  getLikes(@Body() body) {
    const { accessToken, secretToken, userId } = body;
    return this.appService.getLikes(accessToken, secretToken, userId);
  }
}
