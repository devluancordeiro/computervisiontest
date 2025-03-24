import React, {useEffect, useState} from 'react';
import {
  ImagePickerResponse,
  launchImageLibrary,
} from 'react-native-image-picker';
global.Buffer = require('buffer').Buffer;
import * as tf from '@tensorflow/tfjs';
import {fetch, decodeJpeg} from '@tensorflow/tfjs-react-native';
// import {useTensorflowModel} from 'react-native-fast-tflite';
import {Button, View} from 'react-native';
import {
  SSDLITE_320_MOBILENET_V3_LARGE,
  useObjectDetection,
} from 'react-native-executorch';

const ObjectDetectionScreen = () => {
  //   const [image, setImage] = useState(null);

  // const plugin = useTensorflowModel(require('../../assets/salad.tflite'));
  // useTensorflowModel

  // const model = plugin.model;

  // const tfliteModel = tf.

  const getTFReady = async () => {
    await tf.ready();
    console.log('READY MUST');
  };

  useEffect(() => {
    getTFReady();
  }, []);

  const ssdlite = useObjectDetection({
    modelSource: SSDLITE_320_MOBILENET_V3_LARGE,
  });

  console.log('READY', ssdlite.isReady);

  const runModel = async base64 => {
    console.log('NOW');
    const detections = await ssdlite.forward(
      'https://cdn.vectorstock.com/i/1000v/68/78/different-of-fruits-realistic-vector-21566878.jpg',
    );

    console.log('DETECTIONS', detections);

    for (const detection of detections) {
      console.log('Bounding box: ', detection.bbox);
      console.log('Bounding label: ', detection.label);
      console.log('Bounding score: ', detection.score);
    }
  };

  const handleImageSelect = async (pickerResult: ImagePickerResponse) => {
    try {
      const imageAsset = pickerResult.assets[0];
      console.log('BASE', imageAsset.base64);
      // const imageDataArrayBuffer =  tf.util.encodeString(imageAsset.base64, 'base64').buffer;
      // console.log('IMAGEASSET', imageAsset);
      const teste = runModel(imageAsset.base64);
      // const imageDataArrayBuffer = Buffer.from(imageAsset.base64, 'base64');
      // const response = await fetch(
      //   'https://cdn.pixabay.com/photo/2020/07/01/16/59/cherries-5360265_640.jpg',
      //   {},
      //   {isBinary: true},
      // );
      // const imageDataArrayBuffer = await response.arrayBuffer();
      console.log('DATAARRAY', imageDataArrayBuffer);
      const imageData = new Uint8Array(imageDataArrayBuffer);
      console.log('IMAGEDATA', imageData);
      console.log('BEFORE DECODE');
      const agora = decodeJpeg(imageData);
      console.log('AFTER DECODE');
      console.log('UAI');
      console.log('AGORA', imageData);
      const resizedTensor = tf.image.resizeBilinear(agora, [448, 448]);
      // const int8Tensor = resizedTensor.toInt();
      const batchedTensor = resizedTensor.expandDims(0);
      const tensorArray = await batchedTensor.data(); // Isso retorna um Float32Array

      // Executar a inferência usando o modelo TFLite
      const predictionResult = model?.runSync([tensorArray]);
      console.log(predictionResult);
    } catch (e) {
      console.log('ERRO', e);
    }
  };

  return (
    <View>
      <Button
        title="Select Image"
        onPress={() =>
          launchImageLibrary(
            {mediaType: 'photo', includeBase64: true},
            handleImageSelect,
          )
        }
      />
    </View>
  );
};

export default ObjectDetectionScreen;
