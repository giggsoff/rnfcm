import React from "react";
import {createMaterialTopTabNavigator, createAppContainer, withNavigationFocus} from "react-navigation";

import Map from '../views/Map';
import First from '../views/First';
import Home from '../views/Home';

function lazyScreen(Screen){
  return withNavigationFocus(class extends React.Component {
    render(){
      if(!this.props.isFocused){
        return null;
      }

      return <Screen {...this.props}/>;
    }
  })
}
let MapScreen = lazyScreen(Map);
const MaterialTopTabNavigator = createMaterialTopTabNavigator({
  Home,
  First,
  Map
}, {
  initialRouteName: 'Home',
  activeTintColor: '#f0edf6',
  inactiveTintColor: '#3e2465',
  barStyle: { backgroundColor: '#694fad' },
  navigationOptions: ({ navigation }) => ({
  }),
});

const Application = createAppContainer(MaterialTopTabNavigator);

export default Application;
