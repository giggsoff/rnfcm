import React, {Component} from 'react';
import {StyleSheet, View, Text, Button, RefreshControl, Modal, Platform} from 'react-native';
import GridView from 'react-native-super-grid';
import {removeUserToken} from '../actions/actions';
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
      startDate: moment(new Date()).subtract(1, 'month'),
      endDate: moment(new Date()),
      refreshing: false,
      items: [
        {
          name: 'TURQUOISE', code: '#1abc9c', date: '05:13 4 Dec 2018', score: 56, polyline: [
            {
              latitude: 59.904435,
              longitude: 30.307153
            },
            {
              latitude: 59.944435,
              longitude: 30.367153
            },
            {
              latitude: 59.954435,
              longitude: 30.357153
            }
          ]
        },
        {
          name: 'EMERALD', code: '#2ecc71', date: '09:13 4 Dec 2018', score: 78, polyline: [
            {
              latitude: 59.914435,
              longitude: 30.317153
            },
            {
              latitude: 59.934435,
              longitude: 30.357153
            },
            {
              latitude: 59.944435,
              longitude: 30.357153
            }
          ]
        },
        {
          name: 'PETER RIVER', code: '#3498db', date: '05:13 3 Dec 2018', score: 93, polyline: [
            {
              latitude: 59.914435,
              longitude: 30.357153
            },
            {
              latitude: 59.943435,
              longitude: 30.361153
            },
            {
              latitude: 59.953435,
              longitude: 30.357123
            }
          ]
        }, {
          name: 'AMETHYST', code: '#9b59b6', date: '05:13 2 Dec 2018', score: 82, polyline: [
            {
              latitude: 59.924435,
              longitude: 30.307153
            },
            {
              latitude: 59.914435,
              longitude: 30.317153
            },
            {
              latitude: 59.914435,
              longitude: 30.357153
            }
          ]
        },
        {
          name: 'WET ASPHALT', code: '#34495e', date: '05:13 1 Dec 2018', score: 76, polyline: [
            {
              latitude: 59.904445,
              longitude: 30.301153
            },
            {
              latitude: 59.945435,
              longitude: 30.347153
            },
            {
              latitude: 59.977435,
              longitude: 30.359153
            }
          ]
        }
      ]
    };
    this.confirmDate = this.confirmDate.bind(this);
    this.openCalendar = this.openCalendar.bind(this);
  }

  confirmDate({startDate, endDate, startMoment, endMoment}) {
    this.setState({
      startDate,
      endDate
    });
  }

  openCalendar() {
    this.calendar && this.calendar.open();
  }

  _onPressButton = (item) => {
    this.props.navigation.navigate('Map', {polyline: [item.polyline]});
  };

  _onRefresh = () => {
    this.setState({refreshing: true});
    console.warn("REFRESH");
    console.warn(this.props.token);
    this.setState({refreshing: false});
  };

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
          items={this.state.items}
          style={styles.gridView}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }
          renderItem={item => (
            <View style={[styles.itemContainer, {backgroundColor: item.code}]}>
              <View style={[styles.itemContainer1]}>
                <Text style={styles.itemScore}>Your score: {item.score}</Text>
              </View>
              <View style={[styles.itemContainer2]}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemDate}>{item.date}</Text>
                <Button style={styles.itemButton} onPress={() => this._onPressButton(item)}
                        title="Learn More"/>
              </View>
            </View>
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
    height: 150,
  },
  itemName: {
    fontSize: 16,
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
    color: '#fff',
  },
  itemButton: {
    fontWeight: '600',
    fontSize: 12,
    color: '#fff',
  },
});

const mapStateToProps = state => ({
  token: state.token,
});

const mapDispatchToProps = dispatch => ({
  removeUserToken: () => dispatch(removeUserToken()),
});

export default connect(mapStateToProps, mapDispatchToProps)(First);
