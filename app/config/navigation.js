import React from "react";
import {createMaterialTopTabNavigator, createAppContainer} from "react-navigation";

import Map from '../views/Map';
import First from '../views/First';
import Home from '../views/Home';

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
