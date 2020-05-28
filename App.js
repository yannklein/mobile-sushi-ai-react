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
    name: photo.fileName || "image.jpg",
    type: photo.type,
    uri:
      Platform.OS === "android" ? photo.uri : photo.uri.replace("file://", "")
  });

  return data;
};

const cloudinaryUpload = (photo) => {

  console.log(photo);
  const fromData = new FormData()
  fromData.append('file', photo)
  fromData.append('upload_preset', 'st4y3ops')
  fromData.append("cloud_name", "yanninthesky")

  fetch("https://api.cloudinary.com/v1_1/yanninthesky/upload", {
      method: "post",
      body: fromData
    })
    .then(res => res.json())
    .then(dat => {
      console.log("Upload okay!", dat)
    })
    .catch(err => {
      console.log("An Error Occured While Uploading")
    })
};

export default class App extends React.Component {

  state = {
    photo: null,
    answer: {
        result: "salomn",
        details: {salmon: 32, tuna: 45, tamago: 43}
      },
    log: ""
  }

  handleChoosePhoto = () => {
    const options = {
      title: 'Select Photo',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    }

    ImagePicker.showImagePicker(options, (response) => {
      // console.log('Response = ', response);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const uri = response.uri;
        const type = response.type;
        const name = response.fileName;
        const source = {
          uri,
          type,
          name,
        }
        this.setState({ photo: source})
      }
    });
  }


  handleUploadPhoto = () => {

    const { photo } = this.state;

    // cloudinaryUpload(photo);

    fetch("https://yanns-ai.onrender.com/analyze", {
      method: "POST",
      body: createFormData(photo)
    })
      .then(response => response.json())
      .then(data => {
        console.log("upload succes", data);
        this.setState(
          {
            answer: data
          }
        );
      })
      .catch(error => {
        console.log("upload error", error);
        this.setState({log: error.toString()});
      });
  };

  render() {
    const { photo, answer, log } = this.state;

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
        <View style={styles.result}>
          <Text style={styles.answer}> { (answer.result === "" ? '' : `That's... a ${answer.result} sushi!`) } </Text>
          <Text style={styles.list}> { (answer.result === "" ? '' : Object.keys(answer.details).map(key => `${key[0].toUpperCase()}${key.substring(1)} sushi - ${answer.details[key]}%\n`).join('') ) } </Text>
          <Text style={styles.parag}> { log } </Text>
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
  result: {
    flex: 1,
    alignItems: 'center'
  },
  answer: {
    fontSize: 24,
    margin: 24
  },
  list: {
    color: '#333333',
    marginBottom: 5
  },
  ask: {
    backgroundColor: '#FF4F64',
    color: 'white'
  }
});
