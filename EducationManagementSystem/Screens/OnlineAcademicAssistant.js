import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const OnlineAcademicAssistant = () => {
  const [questions, setQuestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchQuestions();
    });
  
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    filterQuestions();
  }, [searchTerm, questions]);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get('http://192.168.136.1:3002/questions');
      setQuestions(response.data);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const navigateToAskQuestion = () => {
    navigation.navigate('OnlineAskQuestion');
  };

  const filterQuestions = () => {
    return questions.filter(question =>
      question.question_text.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const navigateToOnlineAnswerQuestion = (questionId) => {
    navigation.navigate('OnlineAnswerQuestion', { questionId });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.questionContainer} onPress={() => navigateToOnlineAnswerQuestion(item.question_id)}>
      <Text>{item.question_text}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Online Academic Session</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Search questions"
        value={searchTerm}
        onChangeText={text => setSearchTerm(text)}
      />
      <FlatList
        data={filterQuestions()}
        renderItem={renderItem}
        keyExtractor={(item) => item.question_id.toString()}
      />
      <TouchableOpacity style={styles.askButton} onPress={navigateToAskQuestion}>
        <Text style={styles.askButtonText}>Ask a Question</Text>
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
  questionContainer: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
  },
  askButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  askButtonText: {
    color: 'white',
    fontSize: 16,
  },
  searchInput: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
  },
});

export default OnlineAcademicAssistant;
