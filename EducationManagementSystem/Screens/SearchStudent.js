import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import { Searchbar, Divider } from 'react-native-paper';
import CustomHeader from '../Components/CustomHeader';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const SearchStudent = ({ navigation }) => {
  const [studentEmails, setStudentEmails] = useState([]);
  const [filteredEmails, setFilteredEmails] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

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

  // Custom theme for Searchbar
  const searchBarTheme = {
    colors: {
      primary: '#4494ad', // Change primary color
    },
  };

  return (
    <View>
      <CustomHeader />
      <Searchbar
        placeholder="Search by email"
        onChangeText={setSearchTerm}
        value={searchTerm}
        style={styles.searchBar}
        theme={searchBarTheme} // Apply custom theme
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
              <View style={styles.emailContainer}>
                <Icon name="email" size={20} color="#000" style={styles.icon} />
                <Text style={styles.emailItem}>{item}</Text>
                <Divider />
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  searchBar: {
    margin: 10,
  },
  emailItem: {
    fontSize: 18,
    padding: 10,
    marginLeft: 10,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    marginRight: 10,
  },
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
});

export default SearchStudent;
