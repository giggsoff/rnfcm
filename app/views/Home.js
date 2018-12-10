import React, { Component } from "react";
import { View, Text, StyleSheet, Button} from 'react-native';

import { removeUserToken } from '../actions/actions';
import { connect } from 'react-redux';

class Home extends Component {
  static navigationOptions = {
    title: 'Main',
  };
  render() {
    return (
      <View style={styles.parentView}>
        <Text style={styles.text}> Welcome </Text>
        <Button
          buttonStyle={{ marginTop: 20 }}
          backgroundColor="#03A9F4"
          title="SIGN OUT"
          onPress={this._signOutAsync}
        />
      </View>
    );
  }
  _signOutAsync = () => {
    this.props.removeUserToken()
      .then(() => {
        this.props.navigation.navigate('SignedOut');
      })
      .catch(error => {
        this.setState({ error })
      })

  };
}

const styles = StyleSheet.create({
  parentView: {
    marginTop: 10,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    fontSize: 50,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
const mapStateToProps = state => ({
  token: state.token,
});

const mapDispatchToProps = dispatch => ({
  removeUserToken: () => dispatch(removeUserToken()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
