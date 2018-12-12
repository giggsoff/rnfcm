import React, {Component} from 'react';
import {StyleSheet, View, Text, Button, RefreshControl, Modal, Platform, TouchableOpacity} from 'react-native';
import GridView from 'react-native-super-grid';
import {getLog} from '../actions/actions';
import {startBackgroundTimer} from '../actions/timer';
import {connect} from 'react-redux';
import Calendar from 'react-native-calendar-select';
import moment from 'moment';

class First extends Component {
  static navigationOptions = {
    title: 'Results',
  };

  constructor(props, context, updater) {
    super(props, context, updater);
    this.state = {
      DeviceIMEI: "",
      token: null,
      startDate: moment(new Date()).subtract(1, 'week'),
      endDate: moment(new Date()),
      refreshing: false,
      trips: [
        //{"drivingIndex":["100"], "duration":["1 min"], "departure": ["Mannanmaentie"], "destination": ["Mannanmaentie"], "startTime": "2018-12-11T17:42:46+02:00", "endTime": "2018-12-11T17:44:06+02:00"},
      ],
    };
    this.confirmDate = this.confirmDate.bind(this);
    this.openCalendar = this.openCalendar.bind(this);
  }

  _getDeviceIMEI = () => {
    const IMEI = require('react-native-imei');
    this.setState({
      DeviceIMEI: IMEI.getImei(),
    })
  };

  confirmDate({startDate, endDate, startMoment, endMoment}) {
    this.setState({
      startDate,
      endDate
    });
    this._onRefresh();
  }

  openCalendar() {
    this.calendar && this.calendar.open();
  }

  _onPressButton = (item) => {
    this.props.navigation.navigate('Map', {from: item.departure[0], to: item.destination[0]});
  };

  _onRefresh = () => {
    this.setState({refreshing: true});
    console.warn("REFRESH");
    console.warn(this.props);
    console.warn(this.state);
    this.setState({refreshing: false});
    this.props.startBackgroundTimer();
    let {user, pass, number, DeviceIMEI} = this.state;
    return this.props.getLog(this.props.token.token, DeviceIMEI, moment(this.state.startDate), moment(this.state.endDate)).then((data) => {
      this.setState({trips:data.fullTrips.trip});
      console.warn(data);
    }).catch((error) => {
      this.setState({error: error.message});
    });
  };

  async componentDidMount() {
    await this._getDeviceIMEI();
    this._onRefresh();
  }

  componentWillReceiveProps(nextProp) {
    console.warn(nextProp)
  }

  render() {
    let color = {
      subColor: '#f0f0f0'
    };
    return (
      <View style={styles.parentView}>
        <View style={styles.container}>
          <View style={styles.buttonContainer}>
            <Text
              style={{
                color: '#6d95da',
                fontWeight: 'bold',
                textAlign: 'center',
              }}
            >
              From {moment(this.state.startDate).format("YYYY-MM-DD")} to {moment(this.state.endDate).format("YYYY-MM-DD")}
            </Text>
          </View>
          <View style={styles.buttonContainer}>
            <Button
              buttonStyle={{width: 30}}
              backgroundColor="#03A9F4"
              title="Open Calendar"
              onPress={this.openCalendar}
            />
          </View>
        </View>

        <Calendar
          i18n="en"
          ref={(calendar) => {
            this.calendar = calendar;
          }}
          color={color}
          format="YYYYMMDD"
          minDate={moment(new Date()).subtract(6, 'month').format("YYYYMMDD")}
          maxDate={moment(new Date()).format("YYYYMMDD")}
          startDate={this.state.startDate}
          endDate={this.state.endDate}
          onConfirm={this.confirmDate}
        />
        <GridView
          itemDimension={150}
          items={this.state.trips}
          style={styles.gridView}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }
          renderItem={item => (
            <TouchableOpacity onPress={() => this._onPressButton(item)}>
              <View style={[styles.itemContainer]}>
                <View style={[styles.itemContainer1]}>
                  <Text style={styles.itemScore}>Your score: {item.drivingIndex[0]}</Text>
                </View>
                <View style={[styles.itemContainer2]}>
                  <Text style={styles.itemDate}>Duration:</Text>
                  <Text style={styles.itemName}>{item.duration[0]}</Text>
                  <Text style={styles.itemDate}>Departure:</Text>
                  <Text style={styles.itemName}>{item.departure[0]}</Text>
                  <Text style={styles.itemDate}>Destination:</Text>
                  <Text style={styles.itemName}>{item.destination[0]}</Text>
                  <Text style={styles.itemDate}>Start:</Text>
                  <Text style={styles.itemName}>{moment(item.startTime[0]).calendar()}</Text>
                  <Text style={styles.itemDate}>End:</Text>
                  <Text style={styles.itemName}>{moment(item.endTime[0]).calendar()}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10
  },
  buttonContainer: {
    flex: 1,
  },
  parentView: {
    marginTop: 10,
    flex: 1,
  },
  gridView: {
    flex: 1,
  },
  itemContainer1: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 60
  },
  itemContainer2: {
    justifyContent: 'flex-end',
  },
  itemContainer: {
    flex: 1,
    borderRadius: 5,
    padding: 10,
    height: 250,
    backgroundColor: '#068806'
  },
  itemName: {
    fontSize: 13,
    color: '#fff',
    fontWeight: '600',
  },
  itemScore: {
    fontSize: 19,
    color: '#fff',
    fontWeight: '800',
  },
  itemDate: {
    fontWeight: '600',
    fontSize: 12,
    color: '#ccc',
  },
  itemButton: {
    fontWeight: '600',
    fontSize: 12,
    color: '#fff',
  },
});

const mapStateToProps = state => ({
  token: state.token,
  results: state.results
});

const mapDispatchToProps = dispatch => ({
  getLog: (token, imei, from, to) => dispatch(getLog(token, imei, from, to)),
  startBackgroundTimer: () => dispatch(startBackgroundTimer()),
});

export default connect(mapStateToProps, mapDispatchToProps)(First);
