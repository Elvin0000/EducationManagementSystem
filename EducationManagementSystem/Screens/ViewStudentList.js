import React, { useState, useEffect } from 'react';
import { View, Text, SectionList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ViewStudentList = () => {
  const navigation = useNavigation();
  const [examData, setExamData] = useState([]);

  // Function to navigate to the detailed view of a specific exam
  const navigateToExamDetails = (email, examName) => {
    navigation.navigate('ExamDetails', { email, examName });
  };

  useEffect(() => {
    // Fetch data from your API endpoint
    fetch('http://192.168.136.1:3002/exams') // Update the URL with your server's address
      .then((response) => response.json())
      .then((data) => {
        setExamData(data);
      })
      .catch((error) => {
        console.error('Error fetching exam data:', error);
      });
  }, []); // Empty dependency array ensures the effect runs only once on mount

  return (
    <View>
      <SectionList
        sections={examData}
        keyExtractor={(item, index) => item + index}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigateToExamDetails(item.email, item.examName)}>
            <Text>{item.examName}</Text>
          </TouchableOpacity>
        )}
        renderSectionHeader={({ section: { email } }) => (
          <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{email}</Text>
        )}
      />
    </View>
  );
};

export default ViewStudentList;
