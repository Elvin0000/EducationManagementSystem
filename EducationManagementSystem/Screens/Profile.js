import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const ProfilePage = () => {
  const [profilePic, setProfilePic] = useState('');
  const [name, setName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [editMode, setEditMode] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const getUserEmail = async () => {
      try {
        const storedEmail = await AsyncStorage.getItem('userEmail');
        if (storedEmail) {
          setEmail(storedEmail);
          fetchUserProfile(storedEmail);
        }
      } catch (error) {
        console.error('Error retrieving user email from AsyncStorage:', error);
      }
    };

    getUserEmail();
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
    try {
      const updatedProfile = {
        username: name,
        dob: dateOfBirth,
        phone_no: phoneNumber,
        email: email,
      };
  
      const response = await axios.post(`http://192.168.136.1:3002/saveProfile?email=${email}`, updatedProfile);
  
      console.log('Profile saved successfully:', response.data);
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setEditMode(false);
    }
  };
  
  const handleDelete = async () => {
    try {
      // Retrieve the email from AsyncStorage
      const storedEmail = await AsyncStorage.getItem('userEmail');
  
      // Ensure that storedEmail is defined before making the request
      if (storedEmail) {
        console.log('Deleting profile with email:', storedEmail);
  
        // Make the delete request with the retrieved email
        const response = await axios.delete(`http://192.168.136.1:3002/deleteProfile?email=${storedEmail}`);
  
        // ... rest of the code ...
      } else {
        console.error('Email is undefined.');
      }
    } catch (error) {
      // Handle the error (e.g., show an error message to the user)
      console.error('Error deleting user profile:', error);
  
      // Handle 404 specifically, if needed
      if (error.response && error.response.status === 404) {
        // Handle 404 error
        console.log('User not found.');
      }
    } finally {
      navigation.navigate('Login');
    }
  };
  
  
  
  
  
  
  

  const handleProfilePicChange = () => {
    // Implement logic to change profile picture
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Profile</Text>
      {!editMode ? (
        <View style={styles.profileInfo1}>
          {/* <Image source={{ uri: profilePic }} style={styles.profilePic} /> */}
          <Text style={styles.profileText}>Name: {name}</Text>
          <Text style={styles.profileText}>Date of Birth: {dateOfBirth}</Text>
          <Text style={styles.profileText}>Phone Number: {phoneNumber}</Text>
          <Text style={styles.profileText}>Email: {email}</Text>
        </View>
      ) : (
        <View style={styles.profileInfo2}>
          <TouchableOpacity onPress={handleProfilePicChange}>
            {/* <Image source={{ uri: profilePic }} style={styles.profilePic} /> */}
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
  },
  profilePic: {
    width: 100,
    height: 100,
    marginBottom: 10,
    borderRadius: 50,
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
    backgroundColor: 'blue',
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