import React, {Component} from 'react';
import {StyleSheet, View, Text, Button} from 'react-native';
import GridView from 'react-native-super-grid';

class First extends Component {
  constructor(props, context, updater) {
    super(props, context, updater);
    this.state = {
      items: [
        {
          name: 'TURQUOISE', code: '#1abc9c', polyline: [
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
          name: 'EMERALD', code: '#2ecc71', polyline: [
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
          name: 'PETER RIVER', code: '#3498db', polyline: [
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
          name: 'AMETHYST', code: '#9b59b6', polyline: [
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
          name: 'WET ASPHALT', code: '#34495e', polyline: [
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

  _onPressButton = (name, polyline) => {
    console.warn(name);
    this.props.navigation.navigate('Map', {polyline: [polyline]});
  };

  render() {
    return (
      <GridView
        itemDimension={250}
        items={this.state.items}
        style={styles.gridView}
        renderItem={item => (
          <View style={[styles.itemContainer, {backgroundColor: item.code}]}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemCode}>{item.code}</Text>
            <Button style={styles.itemButton} onPress={() => this._onPressButton(item.name, item.polyline)}
                    title="Learn More"/>
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
  itemContainer: {
    justifyContent: 'flex-end',
    borderRadius: 5,
    padding: 10,
    height: 150,
  },
  itemName: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  itemCode: {
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

export default First;
