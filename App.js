import * as React from 'react';
import { Platform, StyleSheet, Text, View, Button, Image } from 'react-native';
import ImagePicker from 'react-native-image-picker'

const instructions = Platform.select({
  ios: `Press Cmd+R to reload,\nCmd+D or shake for dev menu`,
  android: `Double tap R on your keyboard to reload,\nShake or press menu button for dev menu`,
});

const createFormData = (photo) => {
  const data = new FormData();

  data.append("file", {
    name: photo.fileName,
    type: photo.type,
    uri:
      Platform.OS === "android" ? photo.uri : photo.uri.replace("file://", "")
  });

  return data;
};

export default class App extends React.Component {

  state = {
    photo: null,
  }

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


  handleUploadPhoto = () => {

    const { photo } = this.state;

    fetch("http://localhost:5000/analyze", {
      method: "POST",
      body: createFormData(photo)
    })
      .then(response => response.json())
      .then(response => {
        console.log("upload succes", response);
        alert("Upload success!");
        this.setState({ photo: null });
      })
      .catch(error => {
        console.log("upload error", error);
        alert("Upload failed!");
      });
  };

  render() {
    const { photo } = this.state
    return (
      <View style={styles.container}>
        <View style={styles.uploadSection}>
          <Text style={styles.title}> What's the sushi?! 🍣 </Text>
          <Text style={styles.parag}> What kind of sushi are you eating? Let the AI guess! </Text>
          <Button title="Upload a sushi" onPress={this.handleChoosePhoto} />
          <View>
            {photo && (
              <Image
                source={{ uri: photo.uri }}
                style={{ width: 200, height: 200 }}
              />
            )}
          </View>
        </View>
        <View>

        </View>
        <Button style={styles.ask} title="Ask the AI" onPress={this.handleUploadPhoto} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 64,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  uploadSection: {
    flex: 1,
    alignItems: 'center'
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
  ask: {

  }
});
