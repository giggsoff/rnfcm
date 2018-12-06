// TODO https://medium.freecodecamp.org/managing-state-in-a-react-navigation-app-with-redux-6d0b680fb595

import { combineReducers } from 'redux';
import NavReducer from './NavReducer';

const AppReducer = combineReducers({
  nav: NavReducer,
});

export default AppReducer;
