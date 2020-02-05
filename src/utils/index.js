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
  let encoded = base64.encode(unencoded);
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

// ## Export To CSV File
export const exportToCSV = (rows = [["No Data"]], filename = "download.csv") => {
  const processRow = (row) => {
    let finalVal = '';
    for (let j = 0; j < row.length; j++) {
      let innerValue = row[j] === null ? '' : row[j].toString();
      if (row[j] instanceof Date) {
        innerValue = row[j].toLocaleString();
      };
      let result = innerValue.replace(/"/g, '""');
      if (result.search(/("|,|\n)/g) >= 0)
        result = '"' + result + '"';
      if (j > 0)
        finalVal += ',';
      finalVal += result;
    }
    return finalVal + '\n';
  };

  let csvFile = '';
  for (let i = 0; i < rows.length; i++) {
    csvFile += processRow(rows[i]);
  }

  let blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
  if (navigator.msSaveBlob) { // IE 10+
    navigator.msSaveBlob(blob, filename);
  } else {
    let link = document.createElement("a");
    if (link.download !== undefined) { // feature detection
      // Browsers that support HTML5 download attribute
      let url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}
// ## Export To CSV File