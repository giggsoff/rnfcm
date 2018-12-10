import {AsyncStorage} from 'react-native';

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

export const error = error => ({
  type: 'ERROR',
  error,
});

export const login = (username, password) => {
  return (dispatch) => {
    if (!username || !password) {
      dispatch(loading(false));
      dispatch(error(true));
      return new Promise((resolve, reject) => {
        throw new Error("Failed to auth");
      });
    }
    /*fetch('http://192.168.0.115:8080/api/user', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({username: username, password: password})
    })
      .then((res) => res.json())*/
    console.warn("OK");
    return AsyncStorage.setItem('userToken', 'abc').then(res => {
      dispatch(loading(false));
      dispatch(error(false));
      dispatch(saveToken('token saved'));
    })
      .catch((err) => {
        dispatch(loading(false));
        dispatch(error(err.message || 'ERROR'));
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


export const saveUserToken = () => dispatch => {
  console.warn(this.props);
  return AsyncStorage.setItem('userToken', 'abc')
    .then((data) => {
      dispatch(loading(false));
      dispatch(saveToken('token saved'));
    })
    .catch((err) => {
      dispatch(loading(false));
      dispatch(error(err.message || 'ERROR'));
    })
};

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
