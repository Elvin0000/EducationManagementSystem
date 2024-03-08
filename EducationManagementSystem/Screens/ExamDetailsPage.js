import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';

const ExamDetailsPage = ({ route }) => {
  const { examId, email } = route.params;
  const [examResults, setExamResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchExamResults = async () => {
    try {
      const response = await fetch(
        `http://192.168.136.1:3002/studentsExam/Result?email=${email}&examId=${examId}`
      );

      if (!response.ok) {
        console.error('Error fetching exam results:', response.statusText);
        return;
      }

      const data = await response.json();
      setExamResults(data);
    } catch (error) {
      console.error('Error fetching exam results:', error);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchExamResults();
    };

    fetchData();
  }, [examId, email]);

  return (
    <View>
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text>An error occurred while fetching exam results data.</Text>
        </View>
      ) : (
<FlatList
  data={examResults}
  keyExtractor={(item, index) => (item && item.SubjectID ? item.SubjectID.toString() : index.toString())}
  renderItem={({ item }) => {
    console.log('Item:', item);
    console.log('Mark:', item.Mark);

    return (
      <View style={styles.examResultItem}>
        <Text>{item.SubjectName}</Text>
        <Text>Mark: {item.Mark !== undefined ? item.Mark.toString() : 'N/A'}</Text>
      </View>
    );
  }}
/>



      )}
    </View>
  );
};

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  examResultItem: {
    marginVertical: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
});

export default ExamDetailsPage;
