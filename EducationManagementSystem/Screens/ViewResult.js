import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, Button, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ViewResult = ({ route }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const navigation = useNavigation();

  // Retrieve data passed from AddResult page
  const { email, examName, examDate, tableData: initialTableData } = route.params;

  // Create a copy of initialTableData to track changes during edit mode
  const [tableData, setTableData] = useState([...initialTableData]);

  // Calculate average marks
  const totalMarks = tableData.slice(1).reduce((total, row) => total + parseInt(row[2], 10) || 0, 0);
  const totalSubjects = tableData.length - 1; // Exclude the header row
  const averageMarks = totalSubjects > 0 ? totalMarks / totalSubjects : 0;

  // Extract header row
  const [header, ...rows] = tableData;

  // Define data for FlatList
  const data = rows.map((rowData, index) => {
    return {
      key: index.toString(),
      values: rowData,
    };
  });

  // Function to toggle edit mode
  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  // Function to handle edits
  const handleEdit = (rowIndex, columnIndex, value) => {
    if (isEditMode && (columnIndex === 1 || columnIndex === 2)) {
      // Allow editing only for "Subject Name" (columnIndex 1) and "Marks" (columnIndex 2)
      const newData = [...tableData];
      newData[rowIndex + 1][columnIndex] = value; // Add 1 to rowIndex to skip the header row
      setTableData(newData);
    }
  };


  // Function to handle saving changes during edit mode
  const handleSaveChanges = () => {
    // Implement your logic to save changes
    // For example, you can send the updated data to a server

    // After saving changes, exit edit mode
    setIsEditMode(false);

    // Show an alert or any other notification if needed
    Alert.alert('Changes Saved', 'The exam result has been updated successfully.');
  };

  return (
    <View>
      <Text>Student Email: {email}</Text>
      <Text>Exam Name: {examName}</Text>
      <Text>Exam Date: {examDate}</Text>

      <View style={{ borderStyle: 'solid', borderWidth: 1, borderColor: 'gray', marginBottom: 10 }}>
        {/* Display header row */}
        <View style={{ flexDirection: 'row', marginVertical: 5 }}>
          {header.map((cellData, columnIndex) => (
            <Text key={columnIndex} style={{ flex: 1, padding: 5, fontWeight: 'bold' }}>
              {cellData}
            </Text>
          ))}
        </View>

        {/* Display results using FlatList */}
        <FlatList
          data={data}
          renderItem={({ item, index }) => (
            <View style={{ flexDirection: 'row', marginVertical: 5 }}>
              {item.values.map((cellData, columnIndex) => (
                <View key={columnIndex} style={{ flex: 1, padding: 5 }}>
                  {isEditMode && (columnIndex === 1 || columnIndex === 2) ? (
                    <TextInput
                      value={cellData}
                      onChangeText={text => handleEdit(index, columnIndex, text)}
                      style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                    />
                  ) : (
                    <Text style={{ borderColor: 'gray', borderWidth: 0, padding: 5 }}>{cellData}</Text>
                  )}
                </View>
              ))}
            </View>
          )}
          keyExtractor={item => item.key}
        />
      </View>

      <Text>Average Marks: {averageMarks.toFixed(2)}</Text>

      <Button
        title={isEditMode ? 'Save Changes' : 'Update Result'}
        onPress={isEditMode ? handleSaveChanges : toggleEditMode}
      />
    </View>
  );
};

export default ViewResult;
