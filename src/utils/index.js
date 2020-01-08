// ## convert jwt
export const parseJwt = (token) => {
  if (!token) { return; }
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace('-', '+').replace('_', '/');
  return JSON.parse(window.atob(base64));
}
// ## convert jwt

// ## convert base64
let base64 = {}

base64.encode = (unencoded) => {
  return new Buffer(unencoded || '').toString('base64');
};

base64.decode = (encoded) => {
  return new Buffer(encoded || '', 'base64').toString('utf8');
};

base64.urlEncode = (unencoded) => {
  var encoded = base64.encode(unencoded);
  return encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
};

base64.urlDecode = (encoded) => {
  encoded = encoded.replace('-', '+').replace('_', '/');
  while (encoded.length % 4)
    encoded += '=';
  return base64.decode(encoded);
};

export const b64 = base64

// TODO: An example Base64
// console.log("testวัน")
// console.log(base64.urlEncode("testวัน")) // dGVzdOC4p-C4seC4mQ
// console.log(base64.urlDecode("dGVzdOC4p-C4seC4mQ"))
// ## convert base64

// ## convert numbers
export const withCommas = (number) => {
  if (isFinite(number)) {
    return `${number}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }
  return number
}
// ## convert numbers