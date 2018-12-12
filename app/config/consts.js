import xml2js from 'react-native-xml2js'
import moment from 'moment';

export const IMEI = "352830076450596";

export function makeAuthUrl(username, password, number, imei) {
  return 'https://reports.taipaletelematics.fi/SensiorWeb/rest/androidapps/' + username + '/' + password + '/' + number + '/' + imei;
}

export function getLogUrl() {
  return 'https://reports.taipaletelematics.fi/SensiorWeb/rest/drivinglog';
}

export function getLogData(imei, from, to) {
  let obj = {
    "dataFilter": {
      "from": moment(from).format(),
      "to": moment(to).format(),
      "tripType": "DRIVE",
      "mobileIdent": {
        "ident": imei,
        "type": "IMEI"
      }
    }
  };
  let builder = new xml2js.Builder();
  return builder.buildObject(obj);
}
