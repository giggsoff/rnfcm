import React from "react";
import {View, Text, PermissionsAndroid} from "react-native";
import {Card, Button, FormLabel, FormInput} from "react-native-elements";

import { connect } from 'react-redux';
import { saveUserToken, login } from '../actions/actions';

class SignInScreen extends React.Component {
  constructor(props, context, updater) {
    super(props, context, updater);
    this.state = {user: "", pass: "", number: "", error: "", DeviceIMEI: ""}
  }
  static navigationOptions = {
    title: 'Please sign in',
  };

  async requestPermissionPhoneState() {
    try {
      const granted = await PermissionsAndroid.requestMultiple(
        [PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE]
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("You can use phone state");
      } else {
        console.log("Phone state permission denied")
      }
      this._getDeviceIMEI();
    } catch (err) {
      console.warn(err)
    }
  }

  _getDeviceIMEI = () => {
    const IMEI = require('react-native-imei');
    this.setState({
      DeviceIMEI: IMEI.getImei(),
    })
  };

  _signInAsync = () => {
    let { user, pass, number, DeviceIMEI } = this.state;
    return this.props.login(user, pass, number, DeviceIMEI).then(()=>{
      return this.props.navigation.navigate('SignedIn');
    }).catch((error) => {
      this.setState({error: error.message})
    });
  };
  async componentDidMount() {
    await this.requestPermissionPhoneState();
  }
  render() {
    let { error } = this.props;
    return (
      <View style={{paddingVertical: 20}}>
        <Card>
          <FormLabel>Login</FormLabel>
          <FormInput placeholder="Login..." onChangeText={(text) => this.setState({user: text})}/>
          <FormLabel>Password</FormLabel>
          <FormInput secureTextEntry placeholder="Password..." onChangeText={(text) => this.setState({pass: text})}/>
          <FormLabel>Vehicle license plate</FormLabel>
          <FormInput placeholder="Number..." onChangeText={(text) => this.setState({number: text})}/>
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
    login: (username, password, number, imei) => dispatch(login(username, password, number, imei))
});

export default connect(mapStateToProps, mapDispatchToProps)(SignInScreen);
