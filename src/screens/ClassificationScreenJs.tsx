import React, {useEffect, useState} from 'react';
import {Button, Image, SafeAreaView, StatusBar, View} from 'react-native';

const ClassificationScreenJs = () => {
  const [image, setImage] = useState(null);
  const [prediction, setPrediction] = useState(null);

  const loadImageAsTensor = async () => {
    await tf.ready();

    const imageAsset = require('../../assets/image.png');
    const {uri} = Image.resolveAssetSource(imageAsset);

    const response = await fetch(uri);
    const imageData = await response.arrayBuffer();

    let imageTensor = tf2.decodeJpeg(new Uint8Array(imageData));
    imageTensor = tf.image.resizeBilinear(imageTensor, [224, 224]);
    imageTensor = imageTensor.expandDims(0);

    console.log(imageTensor.shape);
    return imageTensor;
  };

  const loadModel = async () => {
    console.log('NOW');
    const model = await tf.loadLayersModel(
      require('../../assets/mobilenet.tflite'),
    );
    loadImageAsTensor();
    return model;
  };

  const runModel = async model => {
    const tensor = tf.tensor3d(image);
    const prediction = await model.predict(tensor);
    setPrediction(prediction);
  };

  useEffect(() => {
    loadModel();
  }, []);

  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar backgroundColor="blue" />
      <View style={{flex: 1, backgroundColor: 'blue'}}>
        {/* <Button title="Pressione" onPress={getClassification} /> */}
      </View>
    </SafeAreaView>
  );
};

export default ClassificationScreenJs;
