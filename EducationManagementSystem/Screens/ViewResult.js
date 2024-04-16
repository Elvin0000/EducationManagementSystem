import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomHeader from '../Components/CustomHeader';
import { Divider } from 'react-native-paper'; // Import Divider from react-native-paper

const ViewResult = () => {
  const [email, setEmail] = useState('');
  const [examinations, setExaminations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation(); // Get the navigation object

  useEffect(() => {
    const fetchEmail = async () => {
      try {
        // Retrieve email from AsyncStorage
        const storedDataString = await AsyncStorage.getItem('userData');
        if (storedDataString) {
          const storedData = JSON.parse(storedDataString);
          const userEmail = storedData.email;
          setEmail(userEmail);
        }
      } catch (error) {
        console.error('Error fetching email from AsyncStorage:', error);
        setError(error);
      }
    };

    fetchEmail();
  }, []);

  const fetchExaminations = async () => {
    try {
      const response = await fetch(`http://192.168.136.1:3002/studentsExamList?email=${email}`);
      const data = await response.json();
      setExaminations(data);
    } catch (error) {
      console.error('Error fetching examinations:', error);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExaminations();
  }, [email]);

  const navigateToExamDetails = (examId) => {
    // Use navigation object to navigate to the next page and pass email and examId as parameters
    navigation.navigate('ExamDetails', { examId, email });
  };

  return (
    <View style={styles.container}>
      <CustomHeader />
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text>An error occurred while fetching examinations data.</Text>
        </View>
      ) : (
        <FlatList
          data={examinations}
          keyExtractor={(item) => item.ExamID.toString()}
          renderItem={({ item }) => (
            <View>
              <TouchableOpacity onPress={() => navigateToExamDetails(item.ExamID)}>
                <Text style={styles.examItem}>{item.ExamName}</Text>
              </TouchableOpacity>
              <Divider />
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  examItem: {
    fontSize: 18,
    padding: 10,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ViewResult;
