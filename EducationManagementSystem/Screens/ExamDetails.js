import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Button, Alert, TextInput, TouchableOpacity, ScrollView} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomHeader from '../Components/CustomHeader';
import NavigateToHomeButton from '../Components/NavigateToHomeButton';

const ExamDetails = ({ route, navigation }) => {
  const { examId, email } = route.params;
  const [examDetails, setExamDetails] = useState({});
  const [examResults, setExamResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedMarks, setEditedMarks] = useState({});
  const [userData, setUserData] = useState(null);

  const fetchExamResults = async () => {
    try {
      const response = await fetch(
        `http://192.168.136.1:3002/studentsExam/detailResult?email=${email}&examId=${examId}`
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

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDataString = await AsyncStorage.getItem('userData');
        if (userDataString) {
          const userData = JSON.parse(userDataString);
          setUserData(userData);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleEditResult = () => {
    setIsEditMode(!isEditMode);
  };

  const handleDeleteResult = async () => {
    // Prompt a confirmation message before deleting
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this result?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              const response = await fetch(`http://192.168.136.1:3002/studentsExam/deleteResult?examId=${examId}`, {
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
          },
        },
      ],
      { cancelable: false }
    );
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
      const response = await fetch('http://192.168.136.1:3002/studentsExam/updateResult', {
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
    <CustomHeader />
    <ScrollView>
      
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text>An error occurred while fetching exam results data.</Text>
        </View>
      ) : (
        <>
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>Student Email: {email}</Text>
            <Text style={styles.infoText}>Exam Name: {examDetails.ExamName}</Text>
            <Text style={styles.infoText}>Exam Date: {formatExamDate(examDetails.ExamDate)}</Text>
          </View>

          <View style={styles.container}>
            <View style={styles.tableHeader}>
              <Text style={styles.headerText}>Subject ID</Text>
              <Text style={styles.headerText}>Subject Name</Text>
              <Text style={styles.headerText}>Mark</Text>
            </View>
  
            <FlatList
              data={examResults}
              renderItem={({ item, index }) => (
                <View style={styles.row}>
                  <Text style={styles.cell}>{item.SubjectID}</Text>
                  <Text style={styles.cell}>{item.SubjectName}</Text>
                    {isEditMode ? (
                      <TextInput
                        defaultValue={editedMarks[index] !== undefined ? editedMarks[index] : item.Mark.toString()}
                        onChangeText={(text) => handleEditMark(index, text)}
                        style={styles.editInput}
                        placeholder="Edit Mark"
                      />
                    ) : (
                      <Text style={styles.cell}>{item.Mark}</Text>
                    )}
                </View>
              )}
              keyExtractor={(item, index) => index.toString()}
            />
  
            <View style={styles.line} />
  
            <View style={styles.averageContainer}>
              <Text style={styles.averageLabel}>Average Marks:</Text>
              <Text style={styles.averageValue}>{averageMarks.toFixed(2)}</Text>
            </View>
          </View>
  
          {userData.admin === 1 || userData.teacher === 1 ? (
            !isEditMode && (
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={handleEditResult}>
                  <Text style={styles.buttonText}>Edit Result</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={handleDeleteResult}>
                  <Text style={styles.buttonText}>Delete Result</Text>
                </TouchableOpacity>
              </View>
            )
          ) : (
            userData.student === 1 ? (
              <View style={{ alignItems: 'flex-end', marginRight: 20 }}>
                <NavigateToHomeButton />
              </View>
            ) : null
          )}

          {isEditMode && (
            <View style={[styles.buttonContainer, { justifyContent: 'flex-end' }]}>
              <TouchableOpacity style={styles.button} onPress={handleSaveChanges}>
                <Text style={styles.buttonText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}
    </ScrollView>
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
  button: {
    backgroundColor: '#4494ad',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    elevation: 5,
    marginRight:10,
    marginLeft:10,
    marginBottom:100,
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    margin: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    paddingHorizontal: 10,
  },
  headerText: {
    flex: 1,
    paddingVertical: 8,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    marginVertical: 10,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  cell: {
    flex: 1,
    paddingVertical: 8,
    textAlign: 'center',
  },
  editInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    backgroundColor: '#F0F8FF',
    textAlign: 'center',
  },
  line: {
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    marginBottom: 10,
  },
  averageContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  averageLabel: {
    fontWeight: 'bold',
  },
  averageValue: {
    marginLeft: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  infoContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    margin: 20,
  },
  infoText: {
    marginBottom: 10,
    fontWeight: 'bold',
  },
  
});

export default ExamDetails;
