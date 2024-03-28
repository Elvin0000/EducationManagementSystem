import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const StudentExam = ({ route }) => {
  const { email } = route.params;
  const [examinations, setExaminations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation(); // Get the navigation object

  const fetchExaminations = async () => {
    try {
      const response = await fetch(`http://192.168.136.1:3002/studentsExam?email=${email}`);
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
    const fetchData = async () => {
      await fetchExaminations();
    };

    fetchData();
  }, [email]);

  const navigateToExamDetails = (examId) => {
    // Use navigation object to navigate to the next page and pass email and examId as parameters
    navigation.navigate('ExamDetailsPage', { examId, email });
  };
  

  return (
    <View>
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
            <TouchableOpacity onPress={() => navigateToExamDetails(item.ExamID)}>
              <Text style={styles.examItem}>{item.ExamName}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
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

export default StudentExam;