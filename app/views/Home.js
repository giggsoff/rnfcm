import React, { Component } from "react";
import { ScrollView, Text, StyleSheet, Button} from 'react-native';

import {onSignOut} from "../auth";

class Home extends Component {

  render() {
    return (
      <ScrollView>
        <Text style={styles.text}> Welcome </Text>
        <Button
          buttonStyle={{ marginTop: 20 }}
          backgroundColor="#03A9F4"
          title="SIGN OUT"
          onPress={() => {
            onSignOut().then(() => this.props.navigation.navigate("SignedOut"));
          }}
        />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    fontSize: 50,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 300,
  },
});

export default Home;
