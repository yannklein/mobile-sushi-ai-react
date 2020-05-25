import * as React from 'react';
import { Platform, StyleSheet, Text, View, Button } from 'react-native';
import ImagePicker from 'react-native-image-picker'

const instructions = Platform.select({
  ios: `Press Cmd+R to reload,\nCmd+D or shake for dev menu`,
  android: `Double tap R on your keyboard to reload,\nShake or press menu button for dev menu`,
});

export default function App() {

  handleChoosePhoto = () => {
    const options = {
      noData: true,
    }
    ImagePicker.launchImageLibrary(options, response => {
      if (response.uri) {
        this.setState({ photo: response })
      }
    })
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}> What's the sushi?! 🍣 </Text>
      <Text style={styles.parag}> What kind of sushi are you eating? Let the AI guess! </Text>
      <Button title="Upload a sushi" onPress={this.handleChoosePhoto} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  title: {
    fontSize: 32,
    margin: 24
  },
  parag: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
