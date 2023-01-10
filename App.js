import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import {Camera} from 'expo-camera';
import * as FaceDetector from 'expo-face-detector';

export default function App() {

  const [hasPermission, sethasPermission] =React.useState();
  const [faceData, setfaceData] = React.useState([]);

  // Asking the user for permission to access camera
  React.useEffect(() =>{
    ( async () =>{
      const {status} = await Camera.requestCameraPermissionsAsync();
      sethasPermission(status === "granted");

    }

    )();

  }, []);

  if (hasPermission === false){
    return <Text> No access to camera - Change settings</Text>;
  }

// function that detects how many faces are on screen
  function getFaceDataView() {
    if (faceData.length === 0){
      return (<View style={styles.faces}><Text style={styles.faceDesc}>I can't see your face Lebza</Text></View>);
    } else {
      return faceData.map((face, index) => {
        const eyesShut = face.rightEyeOpenProbability < 0.4 && face.leftEyeOpenProbability < 0.4;
        const winking = !eyesShut && (face.rightEyeOpenProbability < 0.4 || face.leftEyeOpenProbability < 0.4);
        const smiling = face.smilingProbability > 0.4;
        return (
          <View style={styles.faces} key={index}>
            <Text style={styles.faceDesc}> Lebza's Eyes are Shut: {eyesShut.toString()}</Text>
            <Text style={styles.faceDesc}> Lebza is Winking: {winking.toString()}</Text>
            <Text style={styles.faceDesc}> Lebz is Smiling: {smiling.toString()}</Text>
          </View>

        );
      });

    }
  }

  const handleFacesDetected = ({faces}) => {
    setfaceData(faces) 
    //detect multiple faces
    console.log(faces)
  }









// Use front camera view

  return (
    <Camera type={Camera.Constants.Type.front}
    style={styles.camera}
    onFacesDetected={handleFacesDetected}
    faceDetectorSettings={{
      mode: FaceDetector.FaceDetectorMode.fast,
      detectLandmarks: FaceDetector.FaceDetectorLandmarks.none,
      runClassifications: FaceDetector.FaceDetectorClassifications.all,
      minDetectionInterval: 100,
      tracking: true

    }}
    >
      {getFaceDataView()}
    </Camera>
  );
}

const styles = StyleSheet.create({
  camera: {
    flex: 1,
    
    alignItems: 'center',
    justifyContent: 'center',
  },

  faces:{
    
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 16,
    



  },

  faceDesc: {
    fontSize: 20,
    fontStyle: 'italic',
    color: 'white',
    padding: 10,
    marginBottom: 50,
    
  }
});
