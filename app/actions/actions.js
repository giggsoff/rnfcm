function action(type, payload = {}) {
  return {type, ...payload}
}
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

export const ready = bool => ({
  type: 'READY',
  isLoading: bool,
});

export const error = error => ({
  type: 'ERROR',
  error,
});
