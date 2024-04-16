import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, StyleSheet, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Divider, Searchbar } from 'react-native-paper'; // Import Searchbar from react-native-paper
import CustomHeader from '../Components/CustomHeader';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const StudentExamList = ({ route }) => {
  const { email } = route.params;
  const [examinations, setExaminations] = useState([]);
  const [filteredExaminations, setFilteredExaminations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation(); // Get the navigation object

  const fetchExaminations = async () => {
    try {
      const response = await fetch(`http://192.168.136.1:3002/studentsExamList?email=${email}`);
      const data = await response.json();
      setExaminations(data);
      setFilteredExaminations(data);
    } catch (error) {
      console.error('Error fetching examinations:', error);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterExaminations = () => {
    const filtered = examinations.filter((exam) =>
      exam.ExamName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredExaminations(filtered);
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchExaminations();
    };

    fetchData();
  }, [email]);

  useEffect(() => {
    filterExaminations();
  }, [searchTerm, examinations]);

  const navigateToExamDetails = (examId) => {
    // Use navigation object to navigate to the next page and pass email and examId as parameters
    navigation.navigate('ExamDetails', { examId, email });
  };

  return (
    <View>
      <CustomHeader />
      {/* Include Searchbar component */}
      <Searchbar
        placeholder="Search by exam name"
        onChangeText={(text) => setSearchTerm(text)}
        value={searchTerm}
        style={styles.searchBar}
        // Apply custom theme if needed
      />
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text>An error occurred while fetching examinations data.</Text>
        </View>
      ) : (
        <FlatList
          data={filteredExaminations}
          keyExtractor={(item) => item.ExamID.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => navigateToExamDetails(item.ExamID)}>
              <View style={styles.examContainer}>
                <Icon name="note-outline" size={20} color="#000" style={styles.icon} />
                <Text style={styles.examItem}>{item.ExamName}</Text>
              </View>
              <Divider />
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  examItem: {
    fontSize: 18,
    padding: 10,
    marginLeft: 10,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBar: {
    margin: 10, // Adjust margin as needed
  },
  examContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 10,
    marginLeft: 25,
  },
  
});

export default StudentExamList;
