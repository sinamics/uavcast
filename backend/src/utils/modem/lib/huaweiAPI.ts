/* eslint new-cap: "off" */
import xml2js from 'xml2js';
import crypto from 'crypto';
import request from 'request';

const js2xml = new xml2js.Builder();
const utilities = module.exports;

// Error code names from here: https://github.com/MartijnBraam/huawei-3g/blob/master/huawei_3g/huawei_e303.py
const errorCodes: any = {
  '100002': 'No support', // Huawei branded 404
  '100003': 'Access denied', // Huawei branded 403
  '100004': 'Busy',
  '108001': 'Wrong username',
  '108002': 'Wrong password',
  '108003': 'Already logged in',
  '120001': 'Voice busy',
  '125001': 'Wrong __RequestVerificationToken header',

  '125002': 'Bad request, generic', // ??
  '125003': 'Session tokens missing', // ??
  '100008': 'Unknown', // ??
  '108006': 'Wrong password' // ??
};

utilities.contactRouter = function (uri: any, token: any, post: any, callback: any) {
  const options = {
    url: uri,
    method: 'GET',
    form: '',
    headers: {
      Cookie: token.cookies,
      __RequestVerificationToken: token.token,
      DNT: '1'
    }
  };
  if (post) {
    options.method = 'POST';

    if (typeof post === 'object') options.form = js2xml.buildObject({ request: post });
    else options.form = post;
  }

  request(options, function (error, response, body) {
    if (error) callback(error, null);
    if (!response) return;

    if (response.headers['set-cookie']) token.cookies = response.headers['set-cookie'][0].split(';')[0];
    if (response.headers['__requestverificationtoken']) token.token = response.headers['__requestverificationtoken'];
    // if (response.headers['__requestverificationtokenone']) token.tokenOne = response.headers['__requestverificationtokenone']
    // if (response.headers['__requestverificationtokentwo']) token.tokenTwo = response.headers['__requestverificationtokentwo']

    xml2js.parseString(body, function (error, response) {
      if (!response) return;
      if (response.error) {
        if (errorCodes[response.error.code]) callback(errorCodes[response.error.code]);
        else callback(new Error(response.error.code + ': ' + response.error.message));
      } else {
        callback(error, response.response);
      }
    });
  });
};

// utilities.prepareLogin = function (username:string, password:string, token:string) {
//   /*
//    * Note how the router wants the password to be the following:
//    * 1) Hashed by SHA256, then the raw output base64 encoded.
//    * 2) The username is appended with the result of the above,
//    *	 AND the current token. Yes, the password changes everytime
//    *	 depending on what token we got. This really fucks with scrapers.
//    * 3) The string from above (point 2) is then hashed by SHA256 again,
//    *    and the raw output is once again base64 encoded.
//    *
//    * This is how the router login process works. So the password being sent
//    * changes everytime depending on the current user session/token.
//    * Not bad actually.
//    */
//   var hashedPassword = SHA256andBase64(SHA256andBase64(password) + username + token).toString();

//   var login = {
//     request: {
//       username: username,
//       password: hashedPassword,
//     },
//   };

//   return js2xml.buildObject(login);
// };

utilities.SHA256andBase64 = function (text: any) {
  //@ts-ignore
  return new Buffer.from(crypto.createHash('sha256').update(text).digest('hex'), 'utf-8').toString('base64');
};
