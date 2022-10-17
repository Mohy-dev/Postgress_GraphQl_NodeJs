import fetch from 'node-fetch';

var myHeaders = new Headers();
myHeaders.append('client_id', '');
myHeaders.append('sign', '');
myHeaders.append('t', '');
myHeaders.append('sign_method', 'HMAC-SHA256');
myHeaders.append('secret', '');
myHeaders.append('device_id', '');

var formdata = new FormData();

var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  body: formdata,
  redirect: 'follow',
};

fetch('https://openapi.tuyaeu.com/v1.0/token?grant_type=1', requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.log('error', error));
