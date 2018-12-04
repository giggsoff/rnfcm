import React from "react";
import {createMaterialTopTabNavigator, createSwitchNavigator, createStackNavigator} from "react-navigation";
import { Platform, StatusBar } from "react-native";

import Map from '../views/Map';
import First from '../views/First';
import Home from '../views/Home';
import SignIn from "../views/SignIn";

const headerStyle = {
  marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
};
export const SignedOut = createStackNavigator({
  SignIn: {
    screen: SignIn,
    navigationOptions: {
      title: "Sign In",
      headerStyle
    }
  }
});
export const MaterialTopTabNavigator = createMaterialTopTabNavigator({
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

export const createRootNavigator = (signedIn = false) => {
  return createSwitchNavigator(
    {
      SignedIn: MaterialTopTabNavigator,
      SignedOut: SignedOut
    },
    {
      initialRouteName: signedIn ? "SignedIn" : "SignedOut"
    }
  );
};
