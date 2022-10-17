const qs = require('qs');
const crypto = require('crypto');
const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

let token = '';

const config = {
  /* openapi host */
  host: 'https://openapi.tuyaeu.com',
  /* fetch from openapi platform */
  accessKey: process.env.API_CLIENT_ID,
  /* fetch from openapi platform */
  secretKey: process.env.API_CLIENT_SECRET,
  /* Interface example device_ID */
  deviceId: process.env.DEVICE_ID,
};

const httpClient = axios.create({
  baseURL: config.host,
  timeout: 5 * 1e3,
});

/**
 * fetch highway login token
 */
exports.getToken = async function getToken(deviceId = config.deviceID) {
  const method = 'GET';
  const timestamp = Date.now().toString();
  const signUrl = '/v1.0/token?grant_type=1';
  const contentHash = crypto.createHash('sha256').update('').digest('hex');
  const stringToSign = [method, contentHash, '', signUrl].join('\n');
  const signStr = config.accessKey + timestamp + stringToSign;
  const sign = await encryptStr(signStr, config.secretKey);

  const headers = {
    t: timestamp,
    sign_method: 'HMAC-SHA256',
    client_id: config.accessKey,
    sign: sign,
    device_id: deviceId,
  };
  const { data: login } = await httpClient.get('/v1.0/token?grant_type=1', {
    headers,
  });
  // if (!login || !login.success) {
  //   throw Error(`fetch failed: ${login.msg}`);
  // }

  return login;
};

exports.refreshToken = async function refreshToken(refreshToken) {
  const method = 'GET';
  const timestamp = Date.now().toString();
  const signUrl = `/v1.0/token/${refreshToken}`;
  const contentHash = crypto.createHash('sha256').update('').digest('hex');
  const stringToSign = [method, contentHash, '', signUrl].join('\n');
  const signStr = config.accessKey + timestamp + stringToSign;
  const sign = await encryptStr(signStr, config.secretKey);

  const headers = {
    t: timestamp,
    sign_method: 'HMAC-SHA256',
    client_id: config.accessKey,
    sign: sign,
  };
  const { data: login } = await httpClient.get(`/v1.0/token/${refreshToken}`, {
    headers,
  });
  if (!login || !login.success) {
    throw Error(`fetch failed: ${login.msg}`);
  }

  return login;
};

exports.getLocalKey = async function getLocalKey(tokenBody, deviceID) {
  const method = 'GET';
  const timestamp = Date.now().toString();
  const signUrl = `/v1.0/devices/${deviceID}`;
  const contentHash = crypto.createHash('sha256').update('').digest('hex');
  const stringToSign = [method, contentHash, '', signUrl].join('\n');
  const signStr = config.accessKey + timestamp + stringToSign;

  const headers = {
    t: timestamp,
    sign_method: 'HMAC-SHA256',
    client_id: config.accessKey,
    sign: await encryptStr(signStr, config.secretKey),
    access_token: tokenBody.result.access_token,
  };
  const { data: login } = await httpClient.get(`/v1.0/devices/${deviceID}`, {
    headers,
  });
  if (!login || !login.success) {
    throw Error(`fetch failed: ${login.msg}`);
  }
  if (login.success == true) {
    return login.local_key;
  } else {
    return login;
  }
};

exports.getTempPassword = async function getTempPassword(
  deviceId = config.deviceID,
) {
  const method = 'POST';
  const timestamp = Date.now().toString();
  const signUrl = `/v1.0/devices/${device_id}/door-lock/temp-password`;
  const contentHash = crypto.createHash('sha256').update('').digest('hex');
  const stringToSign = [method, contentHash, '', signUrl].join('\n');
  const signStr = config.accessKey + timestamp + stringToSign;
  const sign = await encryptStr(signStr, config.secretKey);

  const headers = {
    t: timestamp,
    sign_method: 'HMAC-SHA256',
    client_id: config.accessKey,
    sign: sign,
    device_id: deviceId,
  };
  const { data: login } = await httpClient.get(
    `/v1.0/devices/${device_id}/door-lock/temp-password`,
    {
      headers,
    },
  );

  return login;
};

exports.deleteAccessToken = async function getTempPassword(
  deviceId = config.deviceID,
  password,
) {
  const method = 'DELETE';
  const timestamp = Date.now().toString();
  const signUrl = `/v1.0/devices/${deviceId}/door-lock/temp-passwords/${password}`;
  const contentHash = crypto.createHash('sha256').update('').digest('hex');
  const stringToSign = [method, contentHash, '', signUrl].join('\n');
  const signStr = config.accessKey + timestamp + stringToSign;
  const sign = await encryptStr(signStr, config.secretKey);

  const headers = {
    t: timestamp,
    sign_method: 'HMAC-SHA256',
    client_id: config.accessKey,
    sign: sign,
    device_id: deviceId,
  };
  const { data: login } = await httpClient.get(
    `/v1.0/devices/${deviceId}/door-lock/temp-passwords/${password}`,
    {
      headers,
    },
  );

  return login;
};

/**
 * fetch highway business data
 */
async function getDeviceInfo(deviceId) {
  const query = {};
  const method = 'POST';
  const url = `/v1.0/devices/${deviceId}/commands`;
  const reqHeader = await getRequestSign(url, method, {}, query);

  const { data } = await httpClient.request({
    method,
    data: {},
    params: {},
    headers: reqHeaders,
    url: reqHeaders.path,
    withCredentials: false,
  });
  if (!data || !data.success) {
    throw Error(`request api failed: ${data.msg}`);
  }
}

/**
 * HMAC-SHA256 crypto function
 */
async function encryptStr(str, secret) {
  return crypto
    .createHmac('sha256', secret)
    .update(str, 'utf8')
    .digest('hex')
    .toUpperCase();
}

/**
 * request sign, save headers
 * @param path
 * @param method
 * @param headers
 * @param query
 * @param body
 */
async function getRequestSign(
  path,
  method,
  headers = {},
  query = {},
  body = {},
) {
  const t = Date.now().toString();
  const [uri, pathQuery] = path.split('?');
  const queryMerged = Object.assign(query, qs.parse(pathQuery));
  const sortedQuery = {};
  Object.keys(queryMerged)
    .sort()
    .forEach((i) => (sortedQuery[i] = query[i]));

  const querystring = decodeURIComponent(qs.stringify(sortedQuery));
  const url = querystring ? `${uri}?${querystring}` : uri;
  const contentHash = crypto
    .createHash('sha256')
    .update(JSON.stringify(body))
    .digest('hex');
  const stringToSign = [method, contentHash, '', url].join('\n');
  const signStr = config.accessKey + token + t + stringToSign;
  return {
    t,
    path: url,
    client_id: config.accessKey,
    sign: await encryptStr(signStr, config.secretKey),
    sign_method: 'HMAC-SHA256',
    access_token: token,
  };
}

// async function main() {
//   const token = await getToken();
// console.log(token);
//   const rToken = await refreshToken(token.result.refresh_token);
//   await getLocalKey(token, config.deviceID);
// const data = await getDeviceInfo(config.deviceId);
// console.log('fetch success: ', JSON.stringify(data));
// }

// main().catch((err) => {
//   throw Error(`error: ${err}`);
// });
