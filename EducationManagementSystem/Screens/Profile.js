import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { Avatar } from 'react-native-paper';
import SelectAvatar from '../Screens/SelectAvatar';

const ProfilePage = () => {
  const [profilePic, setProfilePic] = useState('');
  const [name, setName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [editMode, setEditMode] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const getUserData = async () => {
      try {
        const userDataString = await AsyncStorage.getItem('userData');
        if (userDataString) {
          const userData = JSON.parse(userDataString);
          const { email } = userData;
          setEmail(email);
          fetchUserProfile(email);
        }
      } catch (error) {
        console.error('Error retrieving user data from AsyncStorage:', error);
      }
    };

    getUserData();
  }, []);

  const fetchUserProfile = async (userEmail) => {
    try {
      const response = await axios.get(`http://192.168.136.1:3002/viewProfile?email=${userEmail}`);
      const userProfile = response.data;
      setProfilePic(userProfile.profilePic);
      setName(userProfile.username);

      const rawDateOfBirth = new Date(userProfile.dob);
      const formattedDateOfBirth = `${rawDateOfBirth.getFullYear()}-${(rawDateOfBirth.getMonth() + 1).toString().padStart(2, '0')}-${rawDateOfBirth.getDate().toString().padStart(2, '0')}`;

      setDateOfBirth(formattedDateOfBirth);
      setPhoneNumber(userProfile.phone_no);

    } catch (error) {
      console.error('Error fetching user profile:', error);
      // Handle the error (display an error message or redirect the user)
    }
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleSave = async () => {
    // Check if the dateOfBirth follows the format yyyy-mm-dd and is a valid date
    if (!isValidDate(dateOfBirth)) {
      Alert.alert('Error', 'Please enter a valid date of birth in the format yyyy-mm-dd.');
      return;
    }
  
    // Check if required fields are not empty
    if (!name.trim() || !phoneNumber.trim()) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }
  
    try {
      const updatedProfile = {
        username: name,
        dob: dateOfBirth,
        phone_no: phoneNumber,
        email: email,
      };
  
      const response = await axios.post(`http://192.168.136.1:3002/updateProfile?email=${email}`, updatedProfile);
  
      console.log('Profile saved successfully:', response.data);
  
      // Show success message
      Alert.alert('Success', 'Profile saved successfully.');
    } catch (error) {
      console.error('Error saving profile:', error);
      
      // Check if the error response has a status code
      if (error.response && error.response.status === 401) {
        Alert.alert('Error', 'Unauthorized. Please check your credentials and try again.');
      } else {
        Alert.alert('Error', 'Failed to save profile. Please try again later.');
      }
    } finally {
      setEditMode(false);
    }
  };
  
  const handleDelete = async () => {
    try {
      // Show confirmation prompt before deleting profile
      Alert.alert(
        'Confirmation',
        'Are you sure you want to delete your profile?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Delete',
            onPress: async () => {
              try {
                // Retrieve the user data from AsyncStorage
                const storedDataString = await AsyncStorage.getItem('userData');
                
                // Parse the stored data and extract the email
                if (storedDataString) {
                  const storedData = JSON.parse(storedDataString);
                  const userEmail = storedData.email;
              
                  console.log('Deleting profile with email:', userEmail);
              
                  // Make the delete request with the retrieved email
                  const response = await axios.delete(`http://192.168.136.1:3002/deleteProfile?email=${userEmail}`);
              
                  // Handle the response if needed
                  // For example, you can check response status and display a success message
                  if (response.status === 200) {
                    Alert.alert('Success', 'Profile deleted successfully.');
                    navigation.navigate('Login');
                  } else {
                    Alert.alert('Error', 'Failed to delete profile. Please try again later.');
                  }
                } else {
                  console.error('User data is undefined.');
                }
              } catch (error) {
                // Handle the error (e.g., show an error message to the user)
                console.error('Error deleting user profile:', error);
              
                // Handle specific errors if needed
                // For example, you can check if the error is a 404 and handle it differently
                Alert.alert('Error', 'Failed to delete profile. Please try again later.');
              }
            },
            style: 'destructive',
          },
        ],
        { cancelable: true }
      );
    } catch (error) {
      console.error('Error showing confirmation prompt:', error);
    }
  };
  
  const handleProfilePicChange = (avatarPath) => {
    setProfilePic(avatarPath);
    navigation.goBack(); // Navigate back to the profile page after selecting an avatar
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

  return (
    <View style={styles.container}>
      <Avatar.Image size={100} source={profilePic ? { uri: profilePic } : require('../assets/avatar/avatar1.png')} />
      <Text style={styles.heading}>Profile</Text>
      {!editMode ? (
        <View style={styles.profileInfo1}>
          <Text style={styles.profileText}>Name: {name}</Text>
          <Text style={styles.profileText}>Date of Birth: {dateOfBirth}</Text>
          <Text style={styles.profileText}>Phone Number: {phoneNumber}</Text>
          <Text style={styles.profileText}>Email: {email}</Text>
        </View>
      ) : (
        <View style={styles.profileInfo2}>
          <TouchableOpacity onPress={() => navigation.navigate('SelectAvatar', { handleProfilePicChange })}>
            <Text style={styles.changePicText}>Change Profile Picture</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={name}
            onChangeText={(text) => setName(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Date of Birth"
            value={dateOfBirth}
            onChangeText={(text) => setDateOfBirth(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            value={phoneNumber}
            onChangeText={(text) => setPhoneNumber(text)}
          />
        </View>
      )}
      {!editMode ? (
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.button} onPress={handleDelete}>
            <Text style={styles.buttonText}>Delete Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleEdit}>
            <Text style={styles.buttonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  heading: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#4494ad',
  },
  changePicText: {
    color: 'blue',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    backgroundColor: '#4494ad',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 10,
    width: '48%',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  profileText: {
    textAlign: 'left',
    marginBottom: 5,
    fontWeight: 'bold',
  },
  profileInfo1: {
    width: '100%',
    alignItems: 'left',
    marginBottom: 20,
  },
  profileInfo2: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  profilePic: {
    width: 100,
    height: 100,
    marginBottom: 10,
    borderRadius: 50,
  },

});

export default ProfilePage;
