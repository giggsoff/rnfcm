import React, {Component} from "react";
import {ScrollView, Text, StyleSheet, Platform, View, PermissionsAndroid} from 'react-native';
import MapView, {UrlTile, Marker, Polyline} from 'react-native-maps';
import {NavigationEvents} from 'react-navigation';
import { removeUserToken } from '../actions/actions';
import { connect } from 'react-redux';

class Map extends Component {
  map = null;
  constructor(props, context, updater) {
    super(props, context, updater);

    this.state = {
      region: {
        latitude: 51.88825,
        longitude: 30.3324,
        latitudeDelta: 0.3922,
        longitudeDelta: 0.3421,
      },
      polyline: [
        /*[
          {
            latitude: 59.904435,
            longitude: 30.307153
          },
          {
            latitude: 59.954435,
            longitude: 30.357153
          }
        ]*/
      ],
      lastLat: null,
      lastLong: null,
      regionSet: false,
      ready: false,
    };
  }

  _onLocationChange = (lastLat, lastLong) => {
    //console.warn(this.map);
    this.setState({
      lastLat: lastLat || this.state.lastLat,
      lastLong: lastLong || this.state.lastLong
    });
  };
  _onPress = () => {
    this.setState({
      regionSet: true
    });
  };
  _onMapChange = (region) => {
    if (this.state.ready) {
      setTimeout(() => {if (this.map) this.map.animateToRegion(region)}, 10);
    }
    this.setState({
      region: region,
      //regionSet: true
    });
  };

  onMapReady = (e) => {
    if (!this.state.ready) {
      this.setState({ready: true});
    }
  };

  onRegionChange = (region) => {
    console.log('onRegionChange', region);
  };

  onRegionChangeComplete = (region) => {
    console.log('onRegionChangeComplete', region);
  };

  androidLocation = {};

  initialGeolocation() {
    if (this.androidLocation) {
      delete this.androidLocation;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.warn('LOCATION getCurrentPosition success', position);
        let region = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.00922 * 2.5,
          longitudeDelta: 0.00421 * 2.5
        };
        if (!this.state.regionSet) {
          this._onMapChange(region);
        }
        this._onLocationChange(region.latitude, region.longitude);
        this.androidLocation = setTimeout(() => this.initialGeolocation(), 5000);
      },
      (error) => {
        console.warn('LOCATION getCurrentPosition error', error.message || error);
        if (Platform.OS === 'android') {
          this.androidLocation = setTimeout(() => this.initialGeolocation(), 1000);
        }
      },
      {
        enableHighAccuracy: (Platform.OS !== 'android'),
        timeout: 2000
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
    console.warn('MAP mounted');
    await this.requestPermissionGPS();
  }

  async componentWillUnmount() {
    console.warn('MAP will unmount');
    if (this.androidLocation) {
      clearTimeout(this.androidLocation);
      delete this.androidLocation;
    }
  }

  onDidFocus = () => {
    let pl = this.props.navigation.getParam('polyline', []);
    console.warn(pl);
    this.setState({polyline: pl});
  };

  render() {

    const {currentRegion} = this.state.region;

    return (
      <View style={styles.container}>
        <NavigationEvents
          onWillFocus={payload => console.warn('will focus', payload)}
          onDidFocus={payload => this.onDidFocus()}
          onWillBlur={payload => console.warn('will blur', payload)}
          onDidBlur={payload => console.warn('did blur', payload)}
        />
        <MapView
          ref={map => {
            this.map = map
          }}
          provider={'osmdroid'}
          style={styles.map}
          initialRegion={currentRegion}
          //region={this.state.region}
          onMapReady={this.onMapReady}
          onRegionChange={this.onRegionChange}
          onRegionChangeComplete={this.onRegionChangeComplete}
          mapType={MapView.MAP_TYPES.NONE}
          onPress={this._onPress}
          onPanDrag={this._onPress}
        >
          <MapView.Marker
            coordinate={{
              latitude: (this.state.lastLat + 0.00050) || 59.904435,
              longitude: (this.state.lastLong + 0.00050) || 30.307153
            }}
            title={"Here I am"}
            description={"Current position"}
            opacity={0.6}
          />
          {
            this.state.polyline.map((item, index) => (
              <MapView.Polyline
                coordinates={item}
                strokeColor="#005"
                strokeWidth={4}
                opacity={0.6}
              />
            ))
          }
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
    flex: 1,
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

const mapStateToProps = state => ({
  token: state.token,
});

const mapDispatchToProps = dispatch => ({
  removeUserToken: () => dispatch(removeUserToken()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Map);
