import React, {Component} from 'react';
import {StyleSheet, View, Text, Button} from 'react-native';
import GridView from 'react-native-super-grid';
import { removeUserToken } from '../actions/actions';
import { connect } from 'react-redux';

class First extends Component {
  constructor(props, context, updater) {
    super(props, context, updater);
    this.state = {
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
  }

  _onPressButton = (item) => {
    this.props.navigation.navigate('Map', {polyline: [item.polyline]});
  };

  render() {
    return (
      <GridView
        itemDimension={150}
        items={this.state.items}
        style={styles.gridView}
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
    );
  }
}

const styles = StyleSheet.create({
  gridView: {
    paddingTop: 25,
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
    flex:1,
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
