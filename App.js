import CameraRoll from '@react-native-community/cameraroll';
import React, { useState } from 'react';
import {
  SafeAreaView,
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  ScrollView,
  PermissionsAndroid
} from 'react-native';
import { 
  TextInput, 
  Button, 
  Card } from 'react-native-paper';
import Video from 'react-native-video';
import { getData } from './insta-download';
import RNFetchBlob from 'rn-fetch-blob';
const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;


const App: () => React$Node = () => {

  const [appState, setAppState] = useState({
    loading: false,
    input: '',
    url: 'https://picsum.photos/700',
    title: '',
    isVideo: false,
    permission: true
  });
  // const saveData = () => {
  //   CameraRoll.save(appState.url, {
  //     type: appState.isVideo ? "video" : "photo"
  //   })
  //   .then(savedData => {
  //     console.log('savedData', savedData);
  //   }).catch(unableToSave => {
  //     console.log('unableToSave', unableToSave);
  //   })
  // }
  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: "Cool Photo App Camera Permission",
          message:
            "Cool Photo App needs access to your camera " +
            "so you can take awesome pictures.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        downloadFile()
      } else {
        setAppState({
          ...appState,
          permission: false
        })
      }
    } catch (err) {
      console.warn(err);
    }
  };
  const getFileExtention = fileUrl => {
    // To get the file extension
    return /[.]/.exec(fileUrl) ?
             /[^.]+$/.exec(fileUrl) : undefined;
  };
  const downloadFile = () => {
   
    // Get today's date to add the time suffix in filename
    let date = new Date();
    // File URL which we want to download
    let FILE_URL = appState.url;    
    // Function to get extention of the file url
    let file_ext = getFileExtention(FILE_URL);
   
    file_ext = '.' + file_ext[0];
   
    // config: To get response by passing the downloading related options
    // fs: Root directory path to download
    const { config, fs } = RNFetchBlob;
    let RootDir = fs.dirs.PictureDir;
    let options = {
      fileCache: true,
      addAndroidDownloads: {
        path:
          RootDir+
          '/file_' + 
          Math.floor(date.getTime() + date.getSeconds() / 2) +
          file_ext,
        description: 'downloading file...',
        notification: true,
        // useDownloadManager works with Android only
        useDownloadManager: true,   
      },
    };
    config(options)
      .fetch('GET', FILE_URL)
      .then(res => {
        // Alert after successful downloading
        console.log('res -> ', JSON.stringify(res));
        alert('File Downloaded Successfully.');
      });
  };
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
          <ScrollView>
            <Text style={{
              fontSize: 20,
              fontWeight: 'bold', 
              textAlign: 'center'}}>Instagram Image/Video Downloader</Text>
            <View style={styles.divider}></View>
            <Text style={styles.fontSize}>Please paste URL in below Box</Text>
            <View style={{
              display: 'flex',
              alignItems: 'center'
            }}>
            <TextInput
                    value={appState.input}
                    onChangeText={(value) => {
                      setAppState({
                        ...appState,
                        input: value
                      })
                    }}
                    style={styles.textInput}>
            </TextInput>
            </View>
            <View style={{
              display: 'flex',
              alignItems: 'center'
            }}>
            <Button 
            style={{
              marginTop: 10,
              width: "80%"
            }}
            mode="contained" onPress={() => {
              setAppState({
                ...appState,
                loading: true
              });
              getData(appState.input).then(({url, title, isVideo}) => {
                setAppState({
                  ...appState,
                  loading: false,
                  url: url,
                  title: title,
                  isVideo: isVideo
                })
              }).catch(e => {
                setAppState({
                  ...appState,
                  loading: false
                })
              });
            }}>
              Search
            </Button>

            </View>

            <Card>
              <Card.Title title={appState.title}  />
              <Card.Content>
                {appState.isVideo ? (
                  <Video 
                  controls={true}
                  style={{
                    width: width - 40,
                    height: height - height / 2
                  }}
                  source={{
                    uri: appState.url
                  }}>
                  </Video>
                ) : (
                  <Image 
                  style={{
                    width: width - 40,
                    height: height - height / 2
                  }}
                  source={{
                    uri: appState.url
                  }} ></Image>
                )}
              </Card.Content>
              {/* <Card.Cover source={{ uri: appState.url }} /> */}
              <Card.Actions>
                <Button
                onPress={requestCameraPermission}
                >Downlaod</Button>
              </Card.Actions>
            </Card>

            {appState.loading ? (
                          <ActivityIndicator style={{
                            marginTop: 10
                          }} size="large" color="#0000ff" />
            ): null}
            {!appState.permission ? <Text>Permission required to download</Text> : null}
          </ScrollView>
      </SafeAreaView>
    </>
  );
};


export default App;

const styles = StyleSheet.create({
  scrollView: {
    height
  },
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height
  },
  textInput: {
    borderBottomColor: "#3279a8",
    width: "95%"
  },
  fontSize: {
    fontSize: 25,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  divider: {
    height: 5,
    backgroundColor: 'black'
  }
})