const cryptoJs = require('crypto-js');

exports.generatePassword = async (token, deviceId) => {
  const localKey = await getLocalKey(token, deviceId);
  const tempPassword = await getTempPassword(deviceId);

  var key = CryptoJS.enc.Base64.parse(localKey);
  var iv = CryptoJS.enc.Base64.parse(tempPassword);
  let password = CryptoJS.AES.decrypt(encrypted, key, { iv: iv });
  return password;
};
