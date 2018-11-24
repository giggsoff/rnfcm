import React from 'react';
import {StyleSheet, Platform, Image, Text, View, ScrollView, AsyncStorage, PermissionsAndroid} from 'react-native';

import firebase from 'react-native-firebase';
import type {RemoteMessage} from 'react-native-firebase';

import MapView, {UrlTile, PROVIDER_OSMDROID, Marker, Polyline} from 'react-native-maps';

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      mapRegion: {
        latitude: 59.88825,
        longitude: 30.3324,
        latitudeDelta: 0.3922,
        longitudeDelta: 0.3421,
      },
      lastLat: null,
      lastLong: null
    };
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

  onRegionChange(region, lastLat, lastLong) {
    this.setState({
      mapRegion: region,
      // If there are no new values set the current ones
      lastLat: lastLat || this.state.lastLat,
      lastLong: lastLong || this.state.lastLong
    });
  }
  androidLocation = {};

  initialGeolocation(){
    delete this.androidLocation;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.warn('LOCATION getCurrentPosition success', position);
        let region = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.00922 * 2.5,
          longitudeDelta: 0.00421 * 2.5
        };
        this.onRegionChange(region, region.latitude, region.longitude);
      },
      (error) => {
        console.warn('LOCATION getCurrentPosition error', error.message || error);
        if (Platform.OS === 'android'){
          this.androidLocation = setTimeout(this.initialGeolocation, 500);
        }
      },
      {
        enableHighAccuracy: (Platform.OS !== 'android'),
        timeout: 10000,
        maximumAge: 500
      }
    );
  }
  async requestPermissionGPS() {
    try {
      const granted = await PermissionsAndroid.requestMultiple(
        [PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION]
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("You can use the location");
      } else {
        console.log("Location permission denied")
      }
      this.initialGeolocation();
    } catch (err) {
      console.warn(err)
    }
  }

  async componentDidMount() {
    // TODO: You: Do firebase things
    //const { user } = await firebase.auth().signInAnonymously();
    //console.warn('User -> ', user.toJSON());

    //await firebase.analytics().logEvent('foo', {bar: '123'});

    await this.requestPermissionGPS();

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
    this.notificationDisplayedListener();
    this.notificationListener();
    this.notificationOpenedListener();
    this.messageListener();
  }

  render() {
    return (
      <View style={styles.container}>
        <MapView
          provider={'osmdroid'}
          style={styles.map}
          initialRegion={this.state.region}
          region={this.state.mapRegion}
          //onRegionChange={this.onRegionChange}>
          //mapType={MapView.MAP_TYPES.NONE}
        >
          <Marker
            coordinate={{
              latitude: (this.state.lastLat + 0.00050) || 59.904435,
              longitude: (this.state.lastLong + 0.00050) || 30.307153
            }}
            title={"Here I am"}
            description={"Current position"}
            opacity={0.6}
          />
          <Polyline
            coordinates={[
              {
                latitude: (this.state.lastLat + 0.00050) || 59.904435,
                longitude: (this.state.lastLong + 0.00050) || 30.307153
              },
              { latitude: (this.state.lastLat + 0.01050) || 59.954435,
                longitude: (this.state.lastLong + 0.01050) || 30.357153
              }
            ]}
            strokeColor="#005"
            strokeWidth={4}
            opacity={0.6}
          />
          <UrlTile
            urlTemplate="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maximumZ={19}
          />
        </MapView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
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
