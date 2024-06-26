import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomHeader from '../Components/CustomHeader';

const OnlineAskQuestion = ({ navigation }) => {
  const [questionText, setQuestionText] = useState('');
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    // Fetch user email from AsyncStorage
    const fetchUserEmail = async () => {
      try {
        const email = await AsyncStorage.getItem('user_email');
        setUserEmail(email);
      } catch (error) {
        console.error('Error retrieving user email from AsyncStorage:', error);
      }
    };

    fetchUserEmail();
  }, []);

  const handlePostQuestion = async () => {
    try {
      if (!questionText.trim()) {
        // Alert user that the question cannot be null
        Alert.alert('Error', 'Question cannot be null');
        console.error('Error posting question: Question cannot be empty');
        return;
      }
  
      // Fetch user data from AsyncStorage
      const userDataString = await AsyncStorage.getItem('userData');
      if (!userDataString) {
        console.error('User data not found in AsyncStorage.');
        return;
      }
  
      // Parse user data JSON
      const userData = JSON.parse(userDataString);
      const userEmail = userData.email;
  
      // Post the question using the retrieved user email
      await axios.post('http://192.168.136.1:3002/addQuestions', { question_text: questionText, asked_by: userEmail });
      setQuestionText('');
      navigation.goBack();
  
      // Inform the user that the question has been posted successfully
      Alert.alert('Success', 'Question posted successfully');
    } catch (error) {
      console.error('Error posting question:', error);
    }
  };
  

  return (
    <View style={styles.container}>
      <CustomHeader title="Ask Question" />
      <View style={styles.content}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  heading: {
    fontSize: 24,
    marginBottom: 20,
    // fontWeight: 'bold',
    color: '#4494ad',
    fontFamily: 'Courgette-Regular',
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
    backgroundColor: '#4494ad',
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
