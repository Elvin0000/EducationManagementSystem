import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { Table, Row } from 'react-native-table-component';

const AddResult = ({ navigation }) => {
  const [studentId, setStudentId] = useState('');
  const [examination, setExamination] = useState('');
  const [examDate, setExamDate] = useState('');

  const [tableData, setTableData] = useState([
    ['No.', 'Subject Name', 'Marks', 'Grade'],
    [1, '', '', ''], // Initial empty row
  ]);

  const addRowHandler = () => {
    setTableData(prevData => [...prevData, [prevData.length + 1, '', '', '']]);
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

  const handleAddResult = () => {
    // Validate Student ID
    if (studentId.trim() === '') {
      Alert.alert('Error', 'Please enter a Student ID');
      return;
    }

    // Navigate to ViewResult and pass the data as a parameter
    navigation.navigate('ViewResult', {
      studentId,
      examination,
      examDate,
      tableData,
    });
  };

  return (
    <View>
      <Text>Student ID:</Text>
      <TextInput
        value={studentId}
        onChangeText={text => setStudentId(text)}
        placeholder="Enter Student ID"
      />

      <Text>Examination:</Text>
      <TextInput value={examination} onChangeText={text => setExamination(text)} placeholder="Enter Examination" />

      <Text>Exam Date:</Text>
      <TextInput value={examDate} onChangeText={text => setExamDate(text)} placeholder="Enter Exam Date" />

      <Table borderStyle={{ borderWidth: 2, borderColor: '#c8e1ff' }}>
        <Row data={tableData[0]} style={{ height: 40, backgroundColor: '#f1f8ff' }} textStyle={{ margin: 6 }} />
        {tableData.slice(1).map((rowData, rowIndex) => (
          <Row
            key={rowIndex}
            data={rowData.map((cellData, columnIndex) => {
              if (columnIndex === 0) {
                return rowIndex + 1;
              } else {
                return (
                  <TextInput
                    key={columnIndex}
                    value={cellData}
                    onChangeText={text => updateTableData(rowIndex + 1, columnIndex, text)}
                    style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                    editable={columnIndex !== 0} // Allow editing for columns other than "No."
                  />
                );
              }
            })}
            style={{ height: 40 }}
          />
        ))}
      </Table>

      <Button title="Add Row" onPress={addRowHandler} />

      <Button title="Add Result" onPress={handleAddResult} />
    </View>
  );
};

export default AddResult;
