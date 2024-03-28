import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Button, Alert, TextInput } from 'react-native';

const ExamDetailsPage = ({ route, navigation }) => {
  const { examId, email } = route.params;
  const [examDetails, setExamDetails] = useState({});
  const [examResults, setExamResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedMarks, setEditedMarks] = useState({});

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
      setExamDetails(data[0]);
      setExamResults(data);
      console.log('Received data from server:', data);
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
      console.log('examResults state:', examResults);
    };

    fetchData();
  }, [examId, email]);

  const handleEditResult = () => {
    setIsEditMode(!isEditMode);
  };

  const handleDeleteResult = async () => {
    try {
      const response = await fetch(`http://192.168.136.1:3002/deleteExam?examId=${examId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Failed to delete exam: ${errorMessage}`);
      }

      Alert.alert('Success', 'Exam and associated subjects deleted successfully', [
        {
          text: 'OK',
          onPress: () => {
            navigation.navigate('Home');
          },
        },
      ]);
    } catch (error) {
      console.error('Error deleting exam:', error);
      Alert.alert('Error', 'Failed to delete exam. Please try again.');
    }
  };

  const formatExamDate = (examDate) => {
    const date = new Date(examDate);
    return date.toISOString().split('T')[0];
  };

  const handleEditMark = (index, text) => {
    // Track the edited marks in the state
    setEditedMarks((prevMarks) => ({ ...prevMarks, [index]: text }));
  
    // Update the examResults directly when editing marks
    const updatedResults = [...examResults];
    updatedResults[index].Mark = text;
    setExamResults(updatedResults);
  };
  const handleSaveChanges = async () => {
    try {
      // Extract email and examId from route.params
      const { email, examId } = route.params;
  
      // Iterate through examResults and update marks for edited subjects
      const updatedResults = examResults.map((result, index) => {
        if (editedMarks[index] !== undefined) {
          return { ...result, Mark: editedMarks[index] };
        }
        return result;
      });
  
      // Log the request payload
      console.log('Request Payload:', {
        email,
        examId,
        updatedResults,
      });
  
      // Make API call to update the marks in the database
      const response = await fetch('http://192.168.136.1:3002/studentsExam/UpdateResult', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, examId, updatedResults }),
      });
  
      // Log the response
      console.log('Response:', response);
  
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Failed to update exam results: ${errorMessage}`);
      }
  
      // Show success message
      Alert.alert('Success', 'Exam results updated successfully', [
        {
          text: 'OK',
          onPress: () => {
            // Refresh the data after update
            setIsEditMode(false);
            fetchExamResults();
          },
        },
      ]);
    } catch (error) {
      console.error('Error updating exam results:', error);
      Alert.alert('Error', 'Failed to update exam results. Please try again.');
    }
  };
  
  
  const totalMarks = examResults.slice(1).reduce((total, row) => total + parseInt(row.Mark, 10) || 0, 0);
  const totalSubjects = examResults.length - 1;
  const averageMarks = totalSubjects > 0 ? totalMarks / totalSubjects : 0;
  return (
    <View>
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text>An error occurred while fetching exam results data.</Text>
        </View>
      ) : (
        <>
          <Text>Student Email: {email}</Text>
          <Text>Exam Name: {examDetails.ExamName}</Text>
          <Text>Exam Date: {formatExamDate(examDetails.ExamDate)}</Text>

          <View style={{ borderStyle: 'solid', borderWidth: 1, borderColor: 'gray', marginBottom: 10 }}>
            <View style={{ flexDirection: 'row', marginVertical: 5 }}>
              <Text style={{ flex: 1, padding: 5, fontWeight: 'bold' }}>Subject ID</Text>
              <Text style={{ flex: 1, padding: 5, fontWeight: 'bold' }}>Subject Name</Text>
              <Text style={{ flex: 1, padding: 5, fontWeight: 'bold' }}>Mark</Text>
            </View>

            <FlatList
              data={examResults}
              renderItem={({ item, index }) => (
                <View style={{ flexDirection: 'row', marginVertical: 5 }}>
                  <Text style={{ flex: 1, padding: 5 }}>{item.SubjectID}</Text>
                  <Text style={{ flex: 1, padding: 5 }}>{item.SubjectName}</Text>
                  <View style={{ flex: 1, padding: 5 }}>
                    {isEditMode ? (
                      <TextInput
                        defaultValue={editedMarks[index] !== undefined ? editedMarks[index] : item.Mark.toString()}
                        onChangeText={(text) => handleEditMark(index, text)}
                        style={{
                          height: 40,
                          borderColor: 'gray',
                          borderWidth: 1,
                          borderRadius: 5,
                          padding: 5,
                          backgroundColor: '#F0F8FF', // Light blue background color
                        }}
                        placeholder="Edit Mark"
                      />
                    ) : (
                      <Text>{item.Mark}</Text>
                    )}
                  </View>
                </View>
              )}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>

          <Text>Average Marks: {averageMarks.toFixed(2)}</Text>

          <View style={styles.buttonContainer}>
          <Button title={isEditMode ? 'Save Changes' : 'Edit Result'} onPress={isEditMode ? handleSaveChanges : handleEditResult} />

            <Button title="Delete Result" onPress={handleDeleteResult} />
          </View>
        </>
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 10,
  },
});

export default ExamDetailsPage;