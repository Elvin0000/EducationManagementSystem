import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';

const OnlineAskQuestion = ({ navigation }) => {
  const [questionText, setQuestionText] = useState('');

  const handlePostQuestion = async () => {
    try {
      if (!questionText.trim()) {
        console.error('Error posting question: Question cannot be empty');
        return;
      }
      // Replace 'user@example.com' with the actual user's email retrieved from AsyncStorage
      const userEmail = 'user@example.com'; // Replace with actual user email
      await axios.post('http://192.168.136.1:3002/questions', { question_text: questionText, asked_by: userEmail });
      // Clear the text input field
      setQuestionText('');
      // Navigate back to the previous screen (Online Academic Assistance)
      navigation.goBack();
    } catch (error) {
      console.error('Error posting question:', error);
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Ask Question</Text>
      <TextInput
        style={styles.input}
        placeholder="Type your question here"
        value={questionText}
        onChangeText={setQuestionText}
        multiline={true}
      />
      <TouchableOpacity style={styles.button} onPress={handlePostQuestion}>
        <Text style={styles.buttonText}>Post Question</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  heading: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    height: 200,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default OnlineAskQuestion;
