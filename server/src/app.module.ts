import {
  Inject,
  Logger,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TwitterStrategy } from './authentication/twitter.strategy';
import * as passport from 'passport';
import * as session from 'cookie-session';
import * as cookieParser from 'cookie-parser';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '/build'),
      exclude: ['/api*'],
    }),
  ],
  controllers: [AppController],
  providers: [AppService, TwitterStrategy],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        session({
          secret: 'elchetito',
          resave: true,
          saveUninitialized: true,
        }),
        passport.initialize(),
        passport.session(),
        cookieParser(),
      )
      .forRoutes('*');
  }
}
