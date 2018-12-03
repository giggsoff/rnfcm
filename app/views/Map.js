import React, { Component } from "react";
import {ScrollView, Text, StyleSheet, Platform, View} from 'react-native';


import MapView, {UrlTile, PROVIDER_OSMDROID, Marker, Polyline} from 'react-native-maps';

class Map extends Component {

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

  onRegionChange(region, lastLat, lastLong) {
    this.setState({
      mapRegion: region,
      // If there are no new values set the current ones
      lastLat: lastLat || this.state.lastLat,
      lastLong: lastLong || this.state.lastLong
    });
  }

  androidLocation = {};

  initialGeolocation() {
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
        if (Platform.OS === 'android') {
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
              {
                latitude: (this.state.lastLat + 0.01050) || 59.954435,
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

export default Map;
