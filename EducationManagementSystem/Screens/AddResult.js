import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ScrollView } from 'react-native';
import { Table, Row } from 'react-native-table-component';
import { useNavigation } from '@react-navigation/native';
import CustomHeader from '../Components/CustomHeader';

const AddResult = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [examName, setExamName] = useState('');
  const [examDate, setExamDate] = useState('');
  const [examID, setExamID] = useState('');

  const [tableData, setTableData] = useState([
    ['Subject ID', 'Subject Name', 'Marks', 'Grade']
  ]);

  // Function to clear the form
  const clearForm = () => {
    setEmail('');
    setExamID('');
    setExamName('');
    setExamDate('');
    setTableData([['Subject ID', 'Subject Name', 'Marks', 'Grade']]);
  };

  useEffect(() => {
    // Clear the form when the component mounts
    clearForm();
  }, []);

  const addRowHandler = () => {
    setTableData((prevData) => [...prevData, ['', '', '', '']]);
  };

  const updateTableData = (rowIndex, columnIndex, value) => {
    const newData = [...tableData];
    newData[rowIndex][columnIndex] = value;

    if (columnIndex === 2) {
      const marks = parseInt(value, 10);

      if (isNaN(marks)) {
        newData[rowIndex][3] = '';
      } else {
        if (marks >= 0 && marks < 40) {
          newData[rowIndex][3] = 'F';
        } else if (marks >= 40 && marks < 60) {
          newData[rowIndex][3] = 'C';
        } else if (marks >= 60 && marks < 80) {
          newData[rowIndex][3] = 'B';
        } else if (marks >= 80 && marks <= 100) {
          newData[rowIndex][3] = 'A';
        } else {
          newData[rowIndex][3] = '';
        }
      }
    }

    setTableData(newData);
  };

  const isValidDate = (date) => {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return false;
    }

    const [year, month, day] = date.split('-').map(Number);
    if (month < 1 || month > 12) {
      return false;
    }

    const daysInMonth = new Date(year, month, 0).getDate();
    return day >= 1 && day <= daysInMonth;
  };


  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleAddResult = async () => {
    try {
      if (email.trim() === '') {
        Alert.alert('Error', 'Email cannot be null');
        return;
      }
  
      if (!validateEmail()) {
        Alert.alert('Error', 'Please enter a valid email');
        return;
      }
  
      if (examID.trim() === '') {
        Alert.alert('Error', 'Exam ID cannot be null');
        return;
      }
  
      if (!examName.trim()) {
        Alert.alert('Error', 'Exam Name cannot be null');
        return;
      }
  
      if (!examDate.trim()) {
        Alert.alert('Error', 'Exam Date cannot be null');
        return;
      }
  
      if (!isValidDate(examDate)) {
        Alert.alert('Error', 'Please enter a valid exam date in the format yyyy-mm-dd');
        return;
      }

      for (let i = 0; i < tableData.length; i++) {
        const [subjectID, subjectName, marks] = tableData[i];
        if (!subjectID || !subjectName || !marks) {
          Alert.alert('Error', 'Subject ID, Subject Name, and Marks cannot be null');
          return;
        }
      }
  
      const response = await fetch('http://192.168.136.1:3002/addResult', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          examID,
          examName,
          examDate,
          tableData,
        }),
      });
  
      console.log('Table Data:', tableData);
      console.log('Data being sent:', { email, examID, examName, examDate, tableData });
  
      if (!response.ok) {
        const errorMessage = await response.json();
        if (response.status === 400) {
          Alert.alert('Error', errorMessage.message);
        } else {
          throw new Error(`Failed to add result: ${errorMessage}`);
        }
        return;
      }
      console.log('API Response:', response);
  
      // Show success message
      Alert.alert('Success', 'Result added successfully', [
        {
          text: 'OK',
          onPress: () => {
            // Navigate back to the home page after clicking OK and clear the form
            navigation.navigate('Home'); // Change 'Home' to the actual name of your home screen
            clearForm();
          },
        },
      ]);
    } catch (error) {
      console.error('Error adding result:', error);
      Alert.alert('Error', 'Failed to add result. Please try again.');
    }
  };
  
  

  return (
    <View style={styles.container}>
      <CustomHeader />
      <ScrollView>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email:</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Exam ID:</Text>
          <TextInput
            style={styles.input}
            value={examID}
            onChangeText={(text) => setExamID(text)}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Exam Name:</Text>
          <TextInput
            style={styles.input}
            value={examName}
            onChangeText={(text) => setExamName(text)}
            placeholder="Exp: Midterm2024"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Exam Date:</Text>
          <TextInput
            style={styles.input}
            value={examDate}
            onChangeText={(text) => setExamDate(text)}
            placeholder="YYYY-MM-DD"
          />
        </View>

        <Table borderStyle={{ borderWidth: 2, borderColor: '#c8e1ff' }}>
          <Row data={tableData[0]} style={{ height: 55, backgroundColor: '#f1f8ff' }} textStyle={styles.tableHeaderCellText} />
          {tableData.slice(1).map((rowData, rowIndex) => (
            <Row
              key={rowIndex}
              data={rowData.map((cellData, columnIndex) => {
                if (columnIndex === 0) {
                  return (
                    <TextInput
                      key={columnIndex}
                      value={cellData}
                      onChangeText={(text) => updateTableData(rowIndex + 1, columnIndex, text)}
                      style={styles.tableInput}
                    />
                  );
                } else {
                  return (
                    <TextInput
                      key={columnIndex}
                      value={cellData}
                      onChangeText={(text) => updateTableData(rowIndex + 1, columnIndex, text)}
                      style={styles.tableInput}
                      editable={columnIndex !== 0}
                    />
                  );
                }
              })}
              textStyle={styles.tableRowText}
            />
          ))}
        </Table>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={addRowHandler}
          >
            <Text style={styles.buttonText}>Add New Row</Text>
          </TouchableOpacity>
          <View style={{ marginLeft: 5 }} />
          <TouchableOpacity
            style={styles.button}
            onPress={handleAddResult}
          >
            <Text style={styles.buttonText}>Upload Result</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    width: 100,
    marginLeft: 20,
    textAlign: 'left',
  },
  input: {
    marginTop: 10,
    flex: 1,
    width: 150,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20, // Adjust the horizontal margin as needed
    marginTop: 20, // Add top margin if needed
    marginBottom: 50,
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
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
    marginBottom: 50, // Adjust as needed
  },
  container: {
    flex: 1,
  },
  tableHeaderCellText: {
    margin: 5,
  },
  tableInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    margin: -1, // Adjust as needed
    textAlign: 'center',
  },
  tableRowText: {
    margin: 6,
  },
});

export default AddResult;
