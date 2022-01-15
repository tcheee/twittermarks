import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as crypto from 'crypto';
const { GoogleSpreadsheet } = require('google-spreadsheet');

@Injectable()
export class AppService {
  twitterLogin(req) {
    if (!req.user) {
      return 'error from twitter';
    } else {
      return {
        message: 'working',
        user: req.user,
      };
    }
  }

  async logUser(user: any) {
    try {
      const doc = new GoogleSpreadsheet(
        '1WwKJFUP4ft1pG3ki0MYcEcH_bffz04BukM-pThW28c4',
      );
      await doc.useServiceAccountAuth({
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      });

      await doc.loadInfo();
      const sheet = doc.sheetsByIndex[0];
      sheet.addRow({
        name: user.name,
        username: user.screen_name,
        location: user.location,
        date: Date.now(),
        link: `https://twitter.com/${user.screen_name}`,
      });
    } catch (err) {
      console.log(err);
    }
  }

  generateTwitterSignatureString(
    method: string,
    url: string,
    url_parameter: string,
    nonce: string,
    timestamp: string,
    appConsumerKey: string,
    userToken: string,
  ) {
    const parameterString =
      'oauth_consumer_key=' +
      encodeURIComponent(appConsumerKey) +
      '&oauth_nonce=' +
      encodeURIComponent(nonce) +
      '&oauth_signature_method=HMAC-SHA1&oauth_timestamp=' +
      encodeURIComponent(timestamp) +
      '&oauth_token=' +
      encodeURIComponent(userToken) +
      '&oauth_version=1.0';

    const finalString = url_parameter
      ? parameterString + '&' + url_parameter
      : parameterString;

    const signatureString =
      method.toUpperCase() +
      '&' +
      encodeURIComponent(url) +
      '&' +
      encodeURIComponent(finalString);

    return signatureString;
  }

  generateTwitterSigningString(
    appSecretToken: string,
    userSecretToken: string,
  ) {
    return (
      encodeURIComponent(appSecretToken) +
      '&' +
      encodeURIComponent(userSecretToken)
    );
  }

  generateTimestampTwitterServerTime() {
    const d = new Date();
    d.setHours(d.getHours() - 1);
    return Math.round(d.getTime() / 1000);
  }

  generateNonce() {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }

  generateTwitterSignature(
    method: string,
    url: string,
    parameter: string,
    nonce: string,
    timestamp: string,
    accessToken,
    secretToken,
  ) {
    const signatureString = this.generateTwitterSignatureString(
      method,
      url,
      parameter,
      nonce,
      timestamp.toString(),
      process.env.APP_ACCESS_TOKEN,
      accessToken,
    );
    const signingKey = this.generateTwitterSigningString(
      process.env.APP_SECRET_TOKEN,
      secretToken,
    );

    const signature = crypto
      .createHmac('sha1', signingKey)
      .update(signatureString)
      .digest('base64');

    return signature;
  }

  generateTwitterHeader(
    method: string,
    url: string,
    parameter: string,
    accessToken,
    secretToken,
  ) {
    const nonce = this.generateNonce();
    const timestamp = this.generateTimestampTwitterServerTime();
    const signature = this.generateTwitterSignature(
      method,
      url,
      parameter,
      nonce,
      timestamp.toString(),
      accessToken,
      secretToken,
    );
    return `OAuth oauth_consumer_key="${
      process.env.APP_ACCESS_TOKEN
    }", oauth_nonce="${encodeURIComponent(
      nonce,
    )}", oauth_signature="${encodeURIComponent(
      signature,
    )}", oauth_signature_method="HMAC-SHA1", oauth_timestamp="${encodeURIComponent(
      timestamp,
    )}", oauth_token="${encodeURIComponent(accessToken)}", oauth_version="1.0"`;
  }

  async lookupUser(accessToken: string, secretToken: string, username: string) {
    const url = `https://api.twitter.com/2/users/by/username/${username}`;
    const url_parameter = 'user.fields=profile_image_url';
    const config = {
      headers: {
        Authorization: this.generateTwitterHeader(
          'GET',
          url,
          url_parameter,
          accessToken,
          secretToken,
        ),
      },
    };

    try {
      const { data } = await axios.get(url + '?' + url_parameter, config);
      if (data.data) {
        return { success: true, data: data.data };
      } else {
        return { sucess: false, data: 'Nothing was found.' };
      }
    } catch (err) {
      console.log(err);
    }
  }

  async getLikes(accessToken: string, secretToken: string, userId: string) {
    let tweets = [];
    let ask = true;
    let next_token = null;
    let i = 0;
    let numberOfTweetsMax = 99;
    const url = `https://api.twitter.com/2/users/${userId}/liked_tweets`;
    console.time('timing');
    while (ask) {
      let url_parameter = next_token ? `pagination_token=${next_token}` : null;
      let query = url_parameter ? url + '?' + url_parameter : url;

      try {
        const { data } = await axios.get(query, {
          headers: {
            Authorization: this.generateTwitterHeader(
              'GET',
              url,
              url_parameter,
              accessToken,
              secretToken,
            ),
          },
        });
        if (data.data && data.meta.next_token && i * 100 < numberOfTweetsMax) {
          next_token = data.meta.next_token;
          i++;
        } else {
          ask = false;
        }
        if (data.data) {
          tweets = tweets.concat(data.data);
        }
      } catch (err) {
        ask = false;
        console.log(err);
        console.log(err.data);
        if (err.response.data.status === 429) {
          const timing_reset = err.response.headers['x-rate-limit-reset'];
          const myDate = new Date(timing_reset * 1000);
          console.log(myDate);
          return { success: false, nextTime: myDate, data: tweets };
        }
      }
    }
    console.timeEnd('timing');

    return { success: true, data: tweets };
  }
}
