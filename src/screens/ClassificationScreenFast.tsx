import React from 'react';
import {Button, Image, SafeAreaView, StatusBar, View} from 'react-native';
import {useTensorflowModel} from 'react-native-fast-tflite';
import * as tf from '@tensorflow/tfjs';
import {decodeJpeg, fetch} from '@tensorflow/tfjs-react-native';

const ClassificationScreenFast = () => {
  // const plugin = useTensorflowModel(require('../../assets/mobilenet.tflite'));
  const plugin = useTensorflowModel(require('../../assets/male_female.tflite'));

  const loadImageAsTensor = async () => {
    try {
      console.log('START');
      await tf.ready();
      console.log('READY');

      // ORANGE CAT (1000) 'https://i.pinimg.com/550x/ed/55/45/ed5545892f20472be0de094eb3e23135.jpg',
      // ORANGE CAT 2 (1000) 'https://i.pinimg.com/474x/e7/dc/04/e7dc04976eb5c4b823a2b31c0c6e6b2c.jpg',
      // FLOWER (989) 'https://hips.hearstapps.com/hmg-prod/images/summer-flowers-sunflower-1648478429.jpg?crop=0.534xw:1.00xh;0.416xw,0&resize=980:*',
      // CAT (989) 'https://live.staticflickr.com/7045/7145490251_15d2d42073_z.jpg',
      // DOG (989) 'https://cdn.shopify.com/s/files/1/0086/0795/7054/files/Golden-Retriever.jpg?v=1645179525',
      // DOG (308) 'https://www.shutterstock.com/image-photo/happy-puppy-welsh-corgi-14-600nw-2270841247.jpg',
      // DOG (125) 'https://www.shutterstock.com/image-photo/red-corgi-puppy-sitting-on-260nw-2102910121.jpg',

      const response = await fetch(
        'https://media.istockphoto.com/id/535484658/photo/cheerful-elegant-woman-looking-away.jpg?s=612x612&w=0&k=20&c=c7aV_ssVcgZi7a-DNM2Xs3HwVIbs7tv83UVXycteusU=',
        {},
        {isBinary: true},
      );
      const imageDataArrayBuffer = await response.arrayBuffer();
      console.log('DATAARRAY', imageDataArrayBuffer);

      const imageData = new Uint8Array(imageDataArrayBuffer);
      console.log('IMAGEDATA', imageData);

      let imageTensor = decodeJpeg(imageData);
      console.log('IMAGETENSOR', imageTensor);

      imageTensor = tf.image.resizeBilinear(imageTensor, [224, 224]);
      imageTensor = imageTensor.expandDims(0);

      console.log('SHAPE', imageTensor.shape);

      const isLoaded = plugin.state === 'loaded';
      if (isLoaded) {
        const imageTensorArray = await imageTensor.data();
        console.log('TENSORARRAY', imageTensorArray);

        const output = plugin.model.runSync([imageTensorArray]);
        console.log('OUTPUT', output);

        const outputFirst = output[0];
        console.log(outputFirst);

        const outputTensor = tf.tensor(outputFirst);
        console.log('OUTPUTTENSOR', outputTensor);

        const softmaxOutput = tf.softmax(outputTensor);
        console.log('SOFTMAX', softmaxOutput);

        softmaxOutput.data().then(probabilities => {
          const maxIndex = probabilities.indexOf(Math.max(...probabilities));
          const maxProbability = probabilities[maxIndex];

          console.log(`Classe: ${maxIndex}, Probabilidade: ${maxProbability}`);
        });
      } else {
        console.log('NOT LOADED');
      }
      return imageTensor;
    } catch (e) {
      console.log('ERR', e);
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar backgroundColor="blue" />
      <View style={{flex: 1, backgroundColor: 'blue'}}>
        <Button title="Pressione" onPress={loadImageAsTensor} />
      </View>
    </SafeAreaView>
  );
};

export default ClassificationScreenFast;
