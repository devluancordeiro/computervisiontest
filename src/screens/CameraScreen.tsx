import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Camera, useCameraDevice} from 'react-native-vision-camera';

const CameraScreen = () => {
  const device = useCameraDevice('back');

  if (!device) {
    return <View style={{flex: 1, backgroundColor: 'red'}} />;
  }

  return (
    <Camera style={StyleSheet.absoluteFill} device={device} isActive={true} />
  );
};

export default CameraScreen;
