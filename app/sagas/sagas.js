import {AsyncStorage} from "react-native";
import {error, ready, getToken, loading, removeToken, saveToken} from "../actions/actions";
import {call, put, all} from "redux-saga/effects";
import { takeEvery } from 'redux-saga'

const auth = (username, password, number, imei) => {
  console.warn(imei);
  return AsyncStorage.setItem('userToken', 'abc');
};

const setAuthToken = () => {
  return AsyncStorage.setItem('userToken', 'abc');
};

const getAuthToken = () => {
  return AsyncStorage.getItem('userToken');
};

const removeAuthToken = () => {
  return AsyncStorage.removeItem('userToken');
};

function* login(username, password, number, imei) {
  try {
    console.warn(imei);
    if (!username || !password || !number || !imei) {
      yield [put(loading(false)), put(error(true))];
    } else {
      const response = yield call(auth, username, password, number, imei);
      yield [put(loading(false)), put(error(false)), put(saveToken('token saved'))];
    }
  } catch (err) {
    yield [put(loading(false)), put(error(err.message || 'ERROR'))];
  }
}

function* getUserToken() {
  try {
      const response = yield call(getAuthToken);
      yield [put(loading(false)), put(error(false)), put(getToken(response)), put(ready(true))];
  } catch (err) {
    yield [put(loading(false)), put(error(err.message || 'ERROR')), put(ready(true))];
  }
}

function* saveUserToken() {
  try {
    const response = yield call(setAuthToken);
    yield [put(loading(false)), put(error(false)), saveToken('token saved')];
  } catch (err) {
    yield [put(loading(false)), put(error(err.message || 'ERROR'))];
  }
}

function* removeUserToken() {
  try {
    const response = yield call(removeAuthToken);
    yield [put(loading(false)), put(error(false)), put(removeToken(response))];
  } catch (err) {
    yield [put(loading(false)), put(error(err.message || 'ERROR'))];
  }
}

function* rootSaga() {
  yield [
    takeEvery('removeUserToken', removeUserToken),
    takeEvery('saveUserToken', saveUserToken),
    takeEvery('getUserToken', getUserToken),
    takeEvery('login', login)
  ]
}

export default rootSaga;
