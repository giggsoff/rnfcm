import { combineReducers } from 'redux';
import { NavigationActions } from 'react-navigation';
import { createRootNavigator } from '../config/navigation';

const router = createRootNavigator.router;
const mainNavAction = router.getActionForPathAndParams('SignedIn');
const initialNavState = router.getStateForAction(mainNavAction);

const NavReducer = (state = initialNavState, action) => {
  return router.getStateForAction(action, state);
};

export default NavReducer;
