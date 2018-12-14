import React, {Component} from 'react';
import {createMaterialTopTabNavigator, createAppContainer} from "react-navigation";
import {createRootNavigator, MaterialTopTabNavigator} from "./config/navigation";
import firebase, {RemoteMessage} from "react-native-firebase";
import {AsyncStorage, PermissionsAndroid} from "react-native";
import {Provider} from 'react-redux';
import configureStore from './store';

export default class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      signedIn: false,
      checkedSignIn: false
    };
    const initialState = {
      token: null
    };
    this.store = configureStore(initialState);
  }

  async checkPermission() {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      await this.getToken();
    } else {
      await this.requestPermission();
    }
  }

  async sendToken(token) {
    let data = {
      method: 'POST',
      body: JSON.stringify({
        "token": token
      }),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    };
    return fetch('http://192.168.1.240:8181', data)
      .then(response => response.json())  // promise
  }


  //3
  async getToken() {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    if (!fcmToken) {
      fcmToken = await firebase.messaging().getToken();
      if (fcmToken) {
        console.warn('Token 1 -> ', fcmToken);
        await this.sendToken(fcmToken);
        // user has a device token
        await AsyncStorage.setItem('fcmToken', fcmToken);
      }
    } else {
      console.warn('Token 2 -> ', fcmToken);
      await this.sendToken(fcmToken);
    }
  }

  //2
  async requestPermission() {
    try {
      await firebase.messaging().requestPermission();
      // User has authorised
      await this.getToken();
    } catch (error) {
      // User has rejected permissions
      console.log('permission rejected');
    }
  }

  async componentDidMount() {
    await this.checkPermission();
    const notificationOpen: NotificationOpen = await firebase.notifications().getInitialNotification();

    if (notificationOpen) {
      const action = notificationOpen.action;
      const notification: Notification = notificationOpen.notification;
      var seen = [];
      alert(JSON.stringify(notification.data, function (key, val) {
        if (val != null && typeof val == "object") {
          if (seen.indexOf(val) >= 0) {
            return;
          }
          seen.push(val);
        }
        return val;
      }));
    }
    const channel = new firebase.notifications.Android.Channel('test-channel', 'Test Channel', firebase.notifications.Android.Importance.Max)
      .setDescription('My apps test channel').setVibrationPattern([0, 1000]);
    // Create the channel
    firebase.notifications().android.createChannel(channel);
    this.notificationDisplayedListener = firebase.notifications().onNotificationDisplayed((notification: Notification) => {
      // Process your notification as required
      // ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.
    });
    this.notificationListener = firebase.notifications().onNotification((notification: Notification) => {
      // Process your notification as required
      notification
        .android.setChannelId('test-channel')
        .android.setSmallIcon('ic_launcher');
      firebase.notifications()
        .displayNotification(notification);

    });
    this.messageListener = firebase.messaging().onMessage((message: RemoteMessage) => {
      // Process your message as required
    });
    this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen: NotificationOpen) => {
      // Get the action triggered by the notification being opened
      const action = notificationOpen.action;
      // Get information about the notification that was opened
      const notification: Notification = notificationOpen.notification;
      var seen = [];
      alert(JSON.stringify(notification.data, function (key, val) {
        if (val != null && typeof val == "object") {
          if (seen.indexOf(val) >= 0) {
            return;
          }
          seen.push(val);
        }
        return val;
      }));
      firebase.notifications().removeDeliveredNotification(notification.notificationId);
    });
  }

  componentWillUnmount() {
    if (this.notificationDisplayedListener) {
      this.notificationDisplayedListener();
    }
    if (this.notificationListener) {
      this.notificationListener();
    }
    if (this.notificationOpenedListener) {
      this.notificationOpenedListener();
    }
    if (this.messageListener) {
      this.messageListener();
    }
  }

  render() {
    const Application = createAppContainer(createRootNavigator);
    return (
      <Provider store={this.store}>
        <Application/>
      </Provider>
    );
  }
}
