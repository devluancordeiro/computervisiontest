import React from 'react';
import {Button, SafeAreaView, StatusBar, View} from 'react-native';
import {EFFICIENTNET_V2_S, useClassification} from 'react-native-executorch';

const ClassificationScreen = () => {
  const classification = useClassification({
    modelSource: EFFICIENTNET_V2_S,
  });

  const getClassification = async () => {
    try {
      const classesWithProbabilities = await classification.forward(
        'https://viajarverde.com.br/wp-content/uploads/2016/07/amazon-rainforest-wallpaper-4-810x506.jpg',
      );

      // Extract three classes with the highest probabilities
      const topThreeClasses = Object.entries(classesWithProbabilities)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([label, score]) => ({label, score}));

      console.log(topThreeClasses);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar backgroundColor="blue" />
      <View style={{flex: 1, backgroundColor: 'blue'}}>
        <Button title="Pressione" onPress={getClassification} />
      </View>
    </SafeAreaView>
  );
};

export default ClassificationScreen;
