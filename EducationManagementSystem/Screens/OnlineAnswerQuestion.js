import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OnlineAnswerQuestion = ({ route }) => {
  const { questionId } = route.params;
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [newAnswer, setNewAnswer] = useState('');
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const fetchQuestionAndAnswers = async () => {
      try {
        const questionResponse = await axios.get(`http://192.168.136.1:3002/questions/${questionId}`);
        setQuestion(questionResponse.data);
        
        const answersResponse = await axios.get(`http://192.168.136.1:3002/questions/${questionId}/answers`);
        setAnswers(answersResponse.data);
      } catch (error) {
        console.error('Error fetching question and answers:', error);
      }
    };
  
    fetchQuestionAndAnswers();
    getUserEmail(); // Fetch user email when component mounts
  }, [questionId]);

  // Function to fetch user email from AsyncStorage
  const getUserEmail = async () => {
    try {
      const email = await AsyncStorage.getItem('user_email');
      setUserEmail(email);
    } catch (error) {
      console.error('Error fetching user email:', error);
    }
  };

// Function to handle posting a new answer
const handleReply = async () => {
    try {
      // Check if newAnswer is not empty
      if (newAnswer.trim() === '') {
        console.error('Please enter an answer.');
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
      const currentTime = new Date().toISOString();
  
      // Post the new answer
      await axios.post(`http://192.168.136.1:3002/questions/${questionId}/answers`, {
        answer_text: newAnswer,
        answered_by: userEmail, // Use the user's email from AsyncStorage
        answered_at: currentTime, // Set the current time
      });
  
      // Fetch updated answers list
      const answersResponse = await axios.get(`http://192.168.136.1:3002/questions/${questionId}/answers`);
      setAnswers(answersResponse.data);
  
      // Clear the new answer input field
      setNewAnswer('');
    } catch (error) {
      console.error('Error posting answer:', error);
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const renderItem = ({ item, index }) => (
    <View style={styles.answerContainer}>
      <Text style={styles.bold}>{index + 1}. {item.answer_text}</Text>
      <View style={{ height: 10 }}></View>
      <Text> By: {item.answered_by}     {formatDate(item.answered_at)}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Questions</Text>
      {question && (
        <View>
          <View style={styles.questionContainer}>
            <Text>{question.question_text}</Text>
            <Text> By: {question.asked_by}     {formatDate(question.asked_at)}</Text>
          </View>
        </View>
      )}
      <Text style={styles.heading}>Answers</Text>
      <FlatList
        data={answers}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }}
        inverted
        />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.replyContainer}
      >
        <TextInput
          style={styles.input}
          placeholder="Your answer..."
          value={newAnswer}
          onChangeText={setNewAnswer}
        />
        <TouchableOpacity style={styles.replyButton} onPress={handleReply}>
          <Text style={styles.replyButtonText}>Reply</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
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
  questionContainer: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
  },
  answerContainer: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
  },
  replyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  replyButton: {
    backgroundColor: 'blue',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  replyButtonText: {
    color: 'white',
    fontSize: 16,
  },
  bold: {
    fontWeight: 'bold',
    color: 'black',
  },
});

export default OnlineAnswerQuestion;
