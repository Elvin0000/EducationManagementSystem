import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const ApproveTeacher = () => {
  const [teacherEmails, setTeacherEmails] = useState([]);
  const [key, setKey] = useState(Date.now()); // Unique key for FlatList
  const navigation = useNavigation();

  useEffect(() => {
    fetchTeacherEmails(); // Fetch teacher emails when component mounts
  }, []); // Effect runs only on mount

  const fetchTeacherEmails = async () => {
    try {
      const response = await axios.get('http://192.168.136.1:3002/approveTeachers');
      setTeacherEmails(response.data);
      setKey(Date.now()); // Change key to force re-render
    } catch (error) {
      console.error('Error fetching teacher emails:', error);
    }
  };

  const handleApprove = async (email) => {
    try {
      console.log('Approving user with email:', email);
  
      // Send the approval request
      const response = await axios.put(`http://192.168.136.1:3002/users/${email}/approveTeacher`);
      
      // Check if the request was successful
      if (response.status === 200) {
        console.log(`User with email ${email} has been approved as a teacher.`);
        // After approval, fetch the updated list of teacher emails
        fetchTeacherEmails();
        navigation.replace('ApproveTeacher'); // Navigate to the same screen
      } else {
        console.error('Failed to approve user:', response.data);
      }
    } catch (error) {
      console.error('Error approving teacher:', error);
    }
  };
  

  const handleReject = async (email) => {
    try {
      console.log('Rejecting user with email:', email);
      await axios.put(`http://192.168.136.1:3002/users/${email}/rejectTeacher`);
      console.log(`User with email ${email} has been rejected.`);
      // After rejection, fetch the updated list of teacher emails
      fetchTeacherEmails();
      navigation.replace('ApproveTeacher'); // Navigate to the same screen
    } catch (error) {
      console.error('Error rejecting teacher:', error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.emailContainer}>
        <Text style={styles.email}>{item}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.approveButton} onPress={() => handleApprove(item)}>
          <Text style={styles.buttonText}>Approve</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.rejectButton} onPress={() => handleReject(item)}>
          <Text style={styles.buttonText}>Reject</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>List of Teacher Emails:</Text>
      <FlatList
        data={teacherEmails}
        renderItem={renderItem}
        keyExtractor={(item) => item}
        key={key} // Unique key for FlatList
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  heading: {
    fontSize: 24,
    marginBottom: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc', // Border color
  },
  emailContainer: {
    flex: 1,
  },
  email: {
    fontSize: 18,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  approveButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  rejectButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ApproveTeacher;