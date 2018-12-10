import React, { Component } from "react";
import { ScrollView, Text, StyleSheet, Button} from 'react-native';

import { removeUserToken } from '../actions/actions';
import { connect } from 'react-redux';

class Home extends Component {
  static navigationOptions = {
    title: 'Main',
  };
  render() {
    return (
      <ScrollView>
        <Text style={styles.text}> Welcome </Text>
        <Button
          buttonStyle={{ marginTop: 20 }}
          backgroundColor="#03A9F4"
          title="SIGN OUT"
          onPress={this._signOutAsync}
        />
      </ScrollView>
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
  text: {
    fontSize: 50,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 300,
  },
});
const mapStateToProps = state => ({
  token: state.token,
});

const mapDispatchToProps = dispatch => ({
  removeUserToken: () => dispatch(removeUserToken()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
