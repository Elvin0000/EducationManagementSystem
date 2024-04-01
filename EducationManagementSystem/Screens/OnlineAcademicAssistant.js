import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import CustomHeader from '../Components/CustomHeader'; 

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
      <CustomHeader title="Online Academic Session" /> 
      <TextInput
        style={styles.searchInput}
        placeholder="Search questions"
        value={searchTerm}
        onChangeText={text => setSearchTerm(text)}
      />
      <View style={styles.flatListContainer}>
        <FlatList
          data={filterQuestions()}
          renderItem={renderItem}
          keyExtractor={(item) => item.question_id.toString()}
          style={styles.flatList}
        />
      </View>
      <TouchableOpacity style={styles.askButton} onPress={navigateToAskQuestion}>
        <Text style={styles.askButtonText}>Ask a Question</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  questionContainer: {
    backgroundColor: '#fff',
    borderRadius: 45,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 20,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 20,
    marginRight: 20,
  },
  askButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#4494ad',
    padding: 10,
    borderRadius: 5,
    elevation: 5,
    alignItems: 'center',
  },

  askButtonText: {
    color: 'white',
    fontSize: 16,
  },
  searchInput: {
    marginTop: 10,
    marginBottom: 20,
    marginLeft: 20,
    marginRight: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
  },
  flatListContainer: {
    flex: 1,
    height: 100,
  },
  flatList: {
    flex: 1,
  },
});


export default OnlineAcademicAssistant;
