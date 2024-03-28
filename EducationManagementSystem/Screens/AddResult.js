import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { Table, Row } from 'react-native-table-component';
import { useNavigation } from '@react-navigation/native';

const AddResult = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [examName, setExamName] = useState('');
  const [examDate, setExamDate] = useState('');
  const [examID, setExamID] = useState('');

  const [tableData, setTableData] = useState([
    ['Subject ID', 'Subject Name', 'Marks', 'Grade'],
    ['', '', '', ''],
  ]);

  // Function to clear the form
  const clearForm = () => {
    setEmail('');
    setExamID('');
    setExamName('');
    setExamDate('');
    setTableData([['Subject ID', 'Subject Name', 'Marks', 'Grade'], ['', '', '', '']]);
  };

  useEffect(() => {
    // Clear the form when the component mounts
    clearForm();
  }, []);

  const addRowHandler = () => {
    setTableData((prevData) => [...prevData, [prevData.length + 1, '', '', '']]);
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

  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleAddResult = async () => {
    try {
      if (email.trim() === '' || examID.trim() === '') {
        Alert.alert('Error', 'Please enter an email and examID');
        return;
      }

      // Check email validation only when the "Add Result" button is pressed
      if (!validateEmail()) {
        Alert.alert('Error', 'Please enter a valid email');
        return;
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
        const errorMessage = await response.text();
        throw new Error(`Failed to add result: ${errorMessage}`);
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
    <View>
      <Text>Email:</Text>
      <TextInput value={email} onChangeText={(text) => setEmail(text)} placeholder="Enter Email" />

      <Text>Exam ID:</Text>
      <TextInput value={examID} onChangeText={(text) => setExamID(text)} placeholder="Enter Exam ID" />

      <Text>Exam Name:</Text>
      <TextInput value={examName} onChangeText={(text) => setExamName(text)} placeholder="Enter Exam Name" />

      <Text>Exam Date:</Text>
      <TextInput value={examDate} onChangeText={(text) => setExamDate(text)} placeholder="Enter Exam Date" />

      <Table borderStyle={{ borderWidth: 2, borderColor: '#c8e1ff' }}>
        <Row data={tableData[0]} style={{ height: 40, backgroundColor: '#f1f8ff' }} textStyle={{ margin: 6 }} />
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
                    style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                  />
                );
              } else {
                return (
                  <TextInput
                    key={columnIndex}
                    value={cellData}
                    onChangeText={(text) => updateTableData(rowIndex + 1, columnIndex, text)}
                    style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                    editable={columnIndex !== 0}
                  />
                );
              }
            })}
            textStyle={{ margin: 6 }}
          />
        ))}
      </Table>

      <Button title="Add Row" onPress={addRowHandler} />

      <Button title="Add Result" onPress={handleAddResult} />
    </View>
  );
};

export default AddResult;