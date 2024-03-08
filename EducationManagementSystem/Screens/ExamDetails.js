// ExamDetails.js
import React from 'react';
import { View, Text } from 'react-native';

const ExamDetails = ({ route }) => {
  const { email, examName } = route.params;

  // Fetch additional exam details based on email and examName

  return (
    <View>
      <Text>Email: {email}</Text>
      <Text>Exam Name: {examName}</Text>
      {/* Display additional exam details here */}
    </View>
  );
};

export default ExamDetails;
