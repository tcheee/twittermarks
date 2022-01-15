"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwitterStrategy = void 0;
const passport_1 = require("@nestjs/passport");
const passport_twitter_1 = require("passport-twitter");
const common_1 = require("@nestjs/common");
let TwitterStrategy = class TwitterStrategy extends (0, passport_1.PassportStrategy)(passport_twitter_1.Strategy, 'twitter') {
    constructor() {
        super({
            consumerKey: 'pxtR3lLg2RNBQf7d10nl3uXVv',
            consumerSecret: 'EJms3OjqDLswsOfdJx1kF5yd0mo7iUb4I3XrdHEqSgzjpfd1QY',
            callbackURL: 'http://localhost:5000/api/auth/twitter/callback',
            proxy: true,
        });
    }
    async validate(accessToken, secretToken, profile, done) {
        profile.accessToken = accessToken;
        profile.secretToken = secretToken;
        done(null, profile);
    }
};
TwitterStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], TwitterStrategy);
exports.TwitterStrategy = TwitterStrategy;
//# sourceMappingURL=twitter.strategy.js.map