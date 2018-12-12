import React from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import { getUserToken } from '../sagas/sagas';

class AuthLoadingScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };
  constructor() {
    super();
  }

  componentDidMount() {
    this._bootstrapAsync();
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = () => {

    this.props.getUserToken().then((result) => {
      console.warn(result);
      this.props.navigation.navigate(this.props.token.token !== null ? 'SignedIn' : 'SignedOut');
    })
      .catch(error => {
        this.setState({ error })
      })

  };

  // Render any loading content that you like here
  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const mapStateToProps = state => ({
  token: state.token,
});


const mapDispatchToProps = dispatch => ({
  getUserToken: () => dispatch({type:'getUserToken'}),
});

export default connect(mapStateToProps, mapDispatchToProps)(AuthLoadingScreen);
