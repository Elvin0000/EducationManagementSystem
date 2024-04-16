import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { Avatar } from 'react-native-paper';
import avatar1 from '../assets/avatar/avatar1.png';
import avatar2 from '../assets/avatar/avatar2.png';
import avatar3 from '../assets/avatar/avatar3.png';
import avatar4 from '../assets/avatar/avatar4.png';
import avatar5 from '../assets/avatar/avatar5.png';
import avatar6 from '../assets/avatar/avatar6.png';
import avatar7 from '../assets/avatar/avatar7.png';
import avatar8 from '../assets/avatar/avatar8.png';
import avatar9 from '../assets/avatar/avatar9.png';
import avatar10 from '../assets/avatar/avatar10.png';


const ProfilePage = () => {
  const [profilePic, setProfilePic] = useState('');
  const [name, setName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
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
      setProfilePic(userProfile.avatar ? avatars[userProfile.avatar - 1] : avatars[0]);
      setName(userProfile.username);
  
      const rawDateOfBirth = new Date(userProfile.dob);
      const formattedDateOfBirth = `${rawDateOfBirth.getFullYear()}-${(rawDateOfBirth.getMonth() + 1).toString().padStart(2, '0')}-${rawDateOfBirth.getDate().toString().padStart(2, '0')}`;
  
      setDateOfBirth(formattedDateOfBirth);
      setPhoneNumber(userProfile.phone_no);
  
    } catch (error) {
      console.error('Error fetching user profile:', error);
      Alert.alert('Error', 'Failed to fetch user profile. Please try again later.');
      // Handle the error (e.g., display an error message to the user)
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
        avatar: selectedAvatar,
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

  const handleAvatarSelection = (avatarIndex) => {
    setSelectedAvatar(avatars[avatarIndex]); // Update selectedAvatar with the selected avatar
  };

  const handleProfilePicChange = async () => {
    try {
      // Send a POST request to update the user's avatar
      const response = await axios.post('http://192.168.136.1:3002/updateAvatar', {
        email: email,
        avatar: selectedAvatar, // Pass the selected avatar to the backend
      });
  
      // Check if the update was successful
      if (response.status === 200) {
        // Update the profile picture displayed in the UI
        setProfilePic(selectedAvatar);
        // Close the modal
        setModalVisible(false);
        // Show success message
        Alert.alert('Success', 'Avatar updated successfully.');
      } else {
        // Handle other response statuses if needed
        Alert.alert('Error', 'Failed to update avatar. Please try again later.');
      }
    } catch (error) {
      console.error('Error updating avatar:', error);
      // Handle the error (e.g., display an error message)
      Alert.alert('Error', 'Failed to update avatar. Please try again later.');
    }
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

  const avatars = [
    avatar1,
    avatar2,
    avatar3,
    avatar4,
    avatar5,
    avatar6,
    avatar7,
    avatar8,
    avatar9,
    avatar10,
  ];

  return (
    <View style={styles.container}>
      <Avatar.Image size={100} source={profilePic} />
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
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Text style={styles.changePicText}>Change Avatar</Text>
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
          <TouchableOpacity style={styles.button} onPress={handleEdit}>
            <Text style={styles.buttonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      )}
      {/* Avatar selection modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.heading}>Select Avatar</Text>
            <View style={styles.avatarContainer}>
              {avatars.map((avatar, index) => (
                <TouchableOpacity key={index} onPress={() => handleAvatarSelection(index)}>
                  <Avatar.Image
                    size={100}
                    source={avatar}
                    style={[styles.avatar, selectedAvatar === avatar && styles.selectedAvatar]}
                  />
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={styles.saveButton} onPress={handleProfilePicChange}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white', // Set background color to white
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
    justifyContent: 'center',
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 40,
    borderRadius: 10,
    alignItems: 'center',
  },
  avatarContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  avatar: {
    margin: 10,
  },
  selectedAvatar: {
    borderWidth: 2,
    borderColor: '#4494ad',
  },
  saveButton: {
    marginTop: 20,
    backgroundColor: '#4494ad',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default ProfilePage;
