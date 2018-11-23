import React from 'react';
import { StyleSheet, Platform, Image, Text, View, ScrollView, AsyncStorage } from 'react-native';

import firebase from 'react-native-firebase';
import type { RemoteMessage } from 'react-native-firebase';

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {};
  }
  async checkPermission() {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      await this.getToken();
    } else {
      await this.requestPermission();
    }
  }

  async sendToken(token){
    let data = {
      method: 'POST',
      body: JSON.stringify({
        "token": token
      }),
      headers: {
        'Accept':       'application/json',
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
    }else{
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
    // TODO: You: Do firebase things
    const { user } = await firebase.auth().signInAnonymously();
    console.warn('User -> ', user.toJSON());

    await firebase.analytics().logEvent('foo', { bar: '123'});

    await this.checkPermission();

    const notificationOpen: NotificationOpen = await firebase.notifications().getInitialNotification();
    if (notificationOpen) {
      const action = notificationOpen.action;
      const notification: Notification = notificationOpen.notification;
      var seen = [];
      alert(JSON.stringify(notification.data, function(key, val) {
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
      .setDescription('My apps test channel').setVibrationPattern([0,1000]);
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
      alert(JSON.stringify(notification.data, function(key, val) {
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
    this.notificationDisplayedListener();
    this.notificationListener();
    this.notificationOpenedListener();
    this.messageListener();
  }

  render() {
    return (
      <ScrollView>
        <View style={styles.container}>
          <Image source={require('./assets/ReactNativeFirebase.png')} style={[styles.logo]}/>
          <Text style={styles.welcome}>
            Welcome to {'\n'} React Native Firebase
          </Text>
          <Text style={styles.instructions}>
            To get started, edit App.js
          </Text>
          {Platform.OS === 'ios' ? (
            <Text style={styles.instructions}>
              Press Cmd+R to reload,{'\n'}
              Cmd+D or shake for dev menu
            </Text>
          ) : (
            <Text style={styles.instructions}>
              Double tap R on your keyboard to reload,{'\n'}
              Cmd+M or shake for dev menu
            </Text>
          )}
          <View style={styles.modules}>
            <Text style={styles.modulesHeader}>The following Firebase modules are pre-installed:</Text>
            {firebase.admob.nativeModuleExists && <Text style={styles.module}>admob()</Text>}
            {firebase.analytics.nativeModuleExists && <Text style={styles.module}>analytics()</Text>}
            {firebase.auth.nativeModuleExists && <Text style={styles.module}>auth()</Text>}
            {firebase.config.nativeModuleExists && <Text style={styles.module}>config()</Text>}
            {firebase.crashlytics.nativeModuleExists && <Text style={styles.module}>crashlytics()</Text>}
            {firebase.database.nativeModuleExists && <Text style={styles.module}>database()</Text>}
            {firebase.firestore.nativeModuleExists && <Text style={styles.module}>firestore()</Text>}
            {firebase.functions.nativeModuleExists && <Text style={styles.module}>functions()</Text>}
            {firebase.iid.nativeModuleExists && <Text style={styles.module}>iid()</Text>}
            {firebase.invites.nativeModuleExists && <Text style={styles.module}>invites()</Text>}
            {firebase.links.nativeModuleExists && <Text style={styles.module}>links()</Text>}
            {firebase.messaging.nativeModuleExists && <Text style={styles.module}>messaging()</Text>}
            {firebase.notifications.nativeModuleExists && <Text style={styles.module}>notifications()</Text>}
            {firebase.perf.nativeModuleExists && <Text style={styles.module}>perf()</Text>}
            {firebase.storage.nativeModuleExists && <Text style={styles.module}>storage()</Text>}
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  logo: {
    height: 120,
    marginBottom: 16,
    marginTop: 64,
    padding: 10,
    width: 135,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  modules: {
    margin: 20,
  },
  modulesHeader: {
    fontSize: 16,
    marginBottom: 8,
  },
  module: {
    fontSize: 14,
    marginTop: 4,
    textAlign: 'center',
  }
});
