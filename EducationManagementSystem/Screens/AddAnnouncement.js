import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomHeader from '../Components/CustomHeader';

const AddAnnouncement = ({ navigation }) => {
  const [announcementText, setAnnouncementText] = useState('');
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    // Fetch user email from AsyncStorage
    const fetchUserEmail = async () => {
      try {
        const email = await AsyncStorage.getItem('user_email');
        setUserEmail(email);
      } catch (error) {
        console.error('Error retrieving user email from AsyncStorage:', error);
      }
    };

    fetchUserEmail();
  }, []);

  const handlePostAnnouncement = async () => {
    try {
      if (!announcementText.trim()) {
        console.error('Error posting announcement: Announcement cannot be empty');
        return;
      }
  
      // Fetch user data from AsyncStorage
      const userDataString = await AsyncStorage.getItem('userData');
      if (!userDataString) {
        console.error('User data not found in AsyncStorage.');
        return;
      }
  
      // Parse user data JSON
      const userData = JSON.parse(userDataString);
      const userEmail = userData.email;
  
      // Post the announcement using the retrieved user email
      await axios.post('http://192.168.136.1:3002/announcements', { announcement_text: announcementText, announced_by: userEmail });
      setAnnouncementText('');
      navigation.goBack();
    } catch (error) {
      console.error('Error posting announcement:', error);
    }
  };

  return (
    <View style={styles.container}>
      <CustomHeader title="Add Announcement" />
      <View style={styles.content}>
        <TextInput
          style={styles.input}
          placeholder="Type your announcement here"
          value={announcementText}
          onChangeText={setAnnouncementText}
          multiline={true}
        />
        <TouchableOpacity style={styles.button} onPress={handlePostAnnouncement}>
          <Text style={styles.buttonText}>Post Announcement</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  heading: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#4494ad',
  },
  input: {
    height: 200,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#4494ad',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default AddAnnouncement;
