import {useState} from 'react';
import {Button, SafeAreaView, StatusBar, Text, TextInput, View} from 'react-native';
import {LLAMA3_2_1B, useLLM} from 'react-native-executorch';

const LlamaScreen = () => {
  const [text, setText] = useState();

  const llama = useLLM({
    modelSource: LLAMA3_2_1B,
    tokenizerSource: require('../../assets/tokenizer.bin'),
    contextWindowLength: 3,
  });

  const getResponse = async () => {
    await llama.generate(text);
  };

  const downloadProgress = llama.downloadProgress;
  const response = llama.response;

  return (
    <SafeAreaView style={{flex: 1}}>
        <StatusBar backgroundColor="blue" />
      <View style={{flex: 1, backgroundColor: 'blue'}}>
        <Text style={{color: 'white'}}>
          Progresso de Download: {downloadProgress}
        </Text>
        <Text style={{color: 'white'}}>Response: {response}</Text>
        <TextInput
          onChangeText={text => setText(text)}
          value={text}
          placeholder='Type your prompt ...'
          style={{color: 'white'}}
        />
        <Button title="Pressione" onPress={getResponse} />
      </View>
    </SafeAreaView>
  );
};

export default LlamaScreen;
