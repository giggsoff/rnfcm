import React from "react";
import {View, Text} from "react-native";
import {Card, Button, FormLabel, FormInput} from "react-native-elements";

import { connect } from 'react-redux';
import { saveUserToken, login } from '../actions/actions';

class SignInScreen extends React.Component {
  constructor(props, context, updater) {
    super(props, context, updater);
    this.state = {user: "", pass: "", error: ""}
  }
  static navigationOptions = {
    title: 'Please sign in',
  };

  _signInAsync = () => {
    let { user, pass } = this.state;
    return this.props.login(user, pass).then(()=>{
      return this.props.navigation.navigate('SignedIn');
    }).catch((error) => {
      this.setState({error: error.message})
    });
  };

  render() {
    let { error } = this.props;
    return (
      <View style={{paddingVertical: 20}}>
        <Card>
          <FormLabel>Login</FormLabel>
          <FormInput placeholder="Login..." onChangeText={(text) => this.setState({user: text})}/>
          <FormLabel>Password</FormLabel>
          <FormInput secureTextEntry placeholder="Password..." onChangeText={(text) => this.setState({pass: text})}/>

          <Button
            buttonStyle={{marginTop: 20}}
            backgroundColor="#03A9F4"
            title="SIGN IN"
            onPress={this._signInAsync}
          />
        </Card>
        <Text style={{marginTop: 20}}>{this.state.error}</Text>
      </View>
    );
  };
}


const mapStateToProps = state => ({
  token: state.token
});


const mapDispatchToProps = (dispatch) => ({
    login: (username, password) => dispatch(login(username, password))
});

export default connect(mapStateToProps, mapDispatchToProps)(SignInScreen);
