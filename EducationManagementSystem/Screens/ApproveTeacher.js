import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import CustomHeader from '../Components/CustomHeader';
import NavigateToHomeButton from '../Components/NavigateToHomeButton';

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
    <>
      <CustomHeader title="Approve Students" />
      <View style={styles.container}>
        <Text style={styles.heading}>Teacher Approval Request:</Text>
        <FlatList
          data={teacherEmails}
          renderItem={renderItem}
          keyExtractor={(item) => item}
          key={key} // Unique key for FlatList
        />
        <View style={styles.buttonWrapper}>
          <NavigateToHomeButton />
        </View>
      </View>
    </>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  heading: {
    fontSize: 20,
    marginBottom: 20,
    fontWeight:"bold",
    color:"#4494ad",
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc', // Border color
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
    marginLeft: 5,
    
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize:12,
  },
  buttonWrapper: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  
});

export default ApproveTeacher;
