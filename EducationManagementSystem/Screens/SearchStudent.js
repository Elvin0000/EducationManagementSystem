// SearchStudent.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';

const SearchStudent = ({ navigation }) => {
  const [studentEmails, setStudentEmails] = useState([]);
  const [filteredEmails, setFilteredEmails] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStudentEmails = async () => {
    try {
      const response = await fetch('http://192.168.136.1:3002/studentsEmailList');
      const data = await response.json();
      setStudentEmails(data);
      setFilteredEmails(data);
    } catch (error) {
      console.error('Error fetching student emails:', error);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterEmails = () => {
    const filtered = studentEmails.filter((email) =>
      email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEmails(filtered);
  };

  const navigateToStudentExam = (email) => {
    navigation.navigate('StudentExamList', { email });
  };
  

  useEffect(() => {
    const fetchData = async () => {
      await fetchStudentEmails();
    };

    fetchData();
  }, []);

  useEffect(() => {
    filterEmails();
  }, [searchTerm, studentEmails]);

  return (
    <View>
      <TextInput
        style={styles.searchBar}
        placeholder="Search by email"
        onChangeText={(text) => setSearchTerm(text)}
        value={searchTerm}
      />

      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text>An error occurred while fetching data.</Text>
        </View>
      ) : (
        <FlatList
          data={filteredEmails}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => navigateToStudentExam(item)}>
              <Text style={styles.emailItem}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  searchBar: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    margin: 10,
    padding: 10,
  },
  emailItem: {
    fontSize: 18,
    padding: 10,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SearchStudent;