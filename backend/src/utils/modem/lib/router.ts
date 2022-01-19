/* eslint @typescript-eslint/no-var-requires: "off" */
const huaweiAPI = require('./huaweiAPI');

const HuaweiRouter: any = function(this: any, options: any) {
  this.options = {
    gateway: '192.168.8.1',
    ...options
  };
};

const API = HuaweiRouter.prototype;
module.exports = HuaweiRouter;
module.exports.create = create;

API.getMonthStatistics = function(token: any, callback: (arg0: any, arg1: any) => void) {
  const uri = 'http://' + this.options.gateway + '/api/monitoring/month_statistics';
  huaweiAPI.contactRouter(uri, token, null, function(error: any, response: any) {
    callback(error, response);
  });
};

API.getSignal = function(token: any, callback: (arg0: any, arg1: any) => void) {
  const uri = 'http://' + this.options.gateway + '/api/device/signal';
  huaweiAPI.contactRouter(uri, token, null, function(error: any, response: any) {
    callback(error, response);
  });
};

API.getStatus = function(token: any, callback: (arg0: any, arg1: any) => void) {
  const uri = 'http://' + this.options.gateway + '/api/monitoring/status';
  huaweiAPI.contactRouter(uri, token, null, function(error: any, response: any) {
    callback(error, response);
  });
};

API.getTrafficStatistics = function(token: any, callback: (arg0: any, arg1: any) => void) {
  const uri = 'http://' + this.options.gateway + '/api/monitoring/traffic-statistics';
  huaweiAPI.contactRouter(uri, token, null, function(error: any, response: any) {
    callback(error, response);
  });
};

API.getBasicSettings = function(token: any, callback: (arg0: any, arg1: any) => void) {
  const uri = 'http://' + this.options.gateway + '/api/wlan/basic-settings';
  huaweiAPI.contactRouter(uri, token, null, function(error: any, response: any) {
    callback(error, response);
  });
};

API.getCurrentPLMN = function(token: any, callback: (arg0: any, arg1: any) => void) {
  const uri = 'http://' + this.options.gateway + '/api/net/current-plmn';
  huaweiAPI.contactRouter(uri, token, null, function(error: any, response: any) {
    callback(error, response);
  });
};

API.getToken = function(callback: (arg0: any, arg1: { cookies: any; token: any }) => void) {
  const uri = 'http://' + this.options.gateway + '/api/webserver/SesTokInfo';
  huaweiAPI.contactRouter(uri, {}, null, function(error: any, response: { SesInfo: any[]; TokInfo: any[] }) {
    callback(error, {
      cookies: response ? response.SesInfo[0] : 'no login',
      token: response ? response.TokInfo[0] : 'no login'
    });
  });
};

API.getLedStatus = function(token: any, callback: (arg0: any, arg1: any) => void) {
  const uri = 'http://' + this.options.gateway + '/api/led/circle-switch';
  huaweiAPI.contactRouter(uri, token, null, function(error: any, response: any) {
    callback(error, response);
  });
};

API.setLedOn = function(token: any, value: any, callback: (arg0: any, arg1: any) => void) {
  const uri = 'http://' + this.options.gateway + '/api/led/circle-switch';
  let body: any = {
    ledSwitch: value ? 1 : 0
  };
  body = `<?xml version:"1.0" encoding="UTF-8"?><request><ledSwitch>${value ? '1' : '0'}</ledSwitch></request>`;
  huaweiAPI.contactRouter(uri, token, body, function(error: any, response: any) {
    callback(error, response);
  });
};

API.isLoggedIn = function(token: any, callback: (arg0: any, arg1: any) => void) {
  const uri = 'http://' + this.options.gateway + '/api/user/state-login';
  huaweiAPI.contactRouter(uri, token, null, function(error: any, response: any) {
    callback(error, response);
  });
};

API.login = function(token: { token: any }, username: any, password: any, callback: (arg0: any, arg1: any) => void) {
  const uri = 'http://' + this.options.gateway + '/api/user/login';
  const body = {
    Username: username,
    password_type: 4,
    Password: huaweiAPI.SHA256andBase64(username + huaweiAPI.SHA256andBase64(password) + token.token)
  };
  huaweiAPI.contactRouter(uri, token, body, function(error: any, response: any) {
    callback(error, response);
  });
};

function create(options: any) {
  return new HuaweiRouter(options);
}
