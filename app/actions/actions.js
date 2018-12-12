import {AsyncStorage} from 'react-native';
import {makeAuthUrl, getLogUrl, getLogData, IMEI} from '../config/consts'
import xml2js from 'react-native-xml2js'
import Geocoder from 'react-native-geocoder-reborn';

export const getToken = (token) => ({
  type: 'GET_TOKEN',
  token,
});

export const saveToken = token => ({
  type: 'SAVE_TOKEN',
  token
});

export const removeToken = () => ({
  type: 'REMOVE_TOKEN',
});

export const loading = bool => ({
  type: 'LOADING',
  isLoading: bool,
});

export const saveResults = results => ({
  type: 'RESULTS',
  results,
});

export const error = error => ({
  type: 'ERROR',
  error,
});

export const getLog = (token, imei, from, to) => {
  imei = IMEI;
  return (dispatch) => {
    return fetch(getLogUrl(), {
      method: 'POST',
      headers: {
        'x-apikey': token,
        'Accept': 'application/xml',
        'Content-Type': 'application/xml',
        'User-Agent': 'Apache-HttpClient/4.1.1 (java 1.5)',
      },
      body: getLogData(imei, from, to)
    }).then((data) => {
      if (data.status !== 400 && data._bodyInit) {
        return new Promise((resolve, reject) => {
          xml2js.parseString(data._bodyInit, function (err, result) {
            if (err) {
              console.warn(err);
              reject("Failed to parse results");
            }
            /*data.fullTrips.trip.map((data) => {
              console.log(data.departure[0]);
              Geocoder.geocodeAddress(data.departure[0]).then(res => {
                console.warn(res);
              })
                .catch(err => console.log(err))
            });*/
            dispatch(saveResults(result));
            resolve(result);
          });
        });
      } else {
        return new Promise((resolve, reject) => {
          throw new Error("Failed to fetch results");
        });
      }
    })
  }
};

export const login = (username, password, number, imei) => {
  return (dispatch) => {
    console.warn(imei);
    if (!username || !password || !number || !imei) {
      dispatch(loading(false));
      dispatch(error(true));
      return new Promise((resolve, reject) => {
        throw new Error("Failed to auth");
      });
    }
    imei = IMEI;
    return fetch(makeAuthUrl(username, password, number, imei), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Apache-HttpClient/4.1.1 (java 1.5)',
      }
    }).then((data) => {
      console.warn(data);
      if (data.status !== 400 && data._bodyText) {
        let token = data._bodyText.replace("Resource created (", "").replace(")", "");
        return AsyncStorage.setItem('userToken', token).then(res => {
          dispatch(loading(false));
          dispatch(error(false));
          dispatch(saveToken(token));
        })
          .catch((err) => {
            dispatch(loading(false));
            dispatch(error(err.message || 'ERROR'));
          });
      } else {
        dispatch(loading(false));
        dispatch(error(true));
        return new Promise((resolve, reject) => {
          throw new Error("Failed to auth");
        });
      }
    }).catch((err) => {
      dispatch(loading(false));
      dispatch(error(err.message || 'ERROR'));
      return new Promise((resolve, reject) => {
        throw new Error("Failed to auth");
      });
    });
  }
};

export const getUserToken = () => dispatch =>
  AsyncStorage.getItem('userToken')
    .then((data) => {
      dispatch(loading(false));
      dispatch(getToken(data));
    })
    .catch((err) => {
      dispatch(loading(false));
      dispatch(error(err.message || 'ERROR'));
    });

export const removeUserToken = () => dispatch =>
  AsyncStorage.removeItem('userToken')
    .then((data) => {
      dispatch(loading(false));
      dispatch(removeToken(data));
    })
    .catch((err) => {
      dispatch(loading(false));
      dispatch(error(err.message || 'ERROR'));
    });
