import { combineReducers } from 'redux';

const rootReducer = (state = {
  token: {},
  loading: true,
  error: null,
  tick: {}
}, action) => {
  switch (action.type) {
    case 'GET_TOKEN':
      return { ...state, token: action.token };
    case 'SAVE_TOKEN':
      return { ...state, token: action.token };
    case 'REMOVE_TOKEN':
      return { ...state, token: action.token };
    case 'LOADING':
      return { ...state, loading: action.isLoading };
    case 'ERROR':
      return { ...state, error: action.error };
    case 'TIMER_TICK':
      return { ...state, tick: action.tick };
    default:
      return state;
  }
};

export default combineReducers({
  token: rootReducer
});
