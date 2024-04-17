import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, TextInput, Alert, Image, ScrollView , KeyboardAvoidingView } from 'react-native';
import { Divider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native'; 
import Icon from 'react-native-vector-icons/MaterialIcons';
import AntIcon from 'react-native-vector-icons/AntDesign';
import changePasswordImage from '../assets/application/changepassword.jpg'; 

const Setting = () => {
  const [changePasswordModalVisible, setChangePasswordModalVisible] = useState(false);
  const [previousPassword, setPreviousPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const navigation = useNavigation(); 

  useEffect(() => {
    const getUserData = async () => {
      try {
        const userDataString = await AsyncStorage.getItem('userData');
        if (userDataString) {
          const userData = JSON.parse(userDataString);
          const { email } = userData;
          setEmail(email);
        }
      } catch (error) {
        console.error('Error retrieving user data from AsyncStorage:', error);
      }
    };

    getUserData();
  }, []);

  const handleChangePassword = () => {
    setChangePasswordModalVisible(true);
  };

  const handleCloseModal = () => {
    setChangePasswordModalVisible(false);
  };

  const getPassword = async (email, previousPassword, newPassword) => {
    try {
      // Fetch the current password associated with the provided email
      const getPasswordResponse = await axios.get(`http://192.168.136.1:3002/getPassword?email=${email}`);
      
      console.log('Password fetch response:', getPasswordResponse.data);
    
      if (getPasswordResponse.data && getPasswordResponse.data.password) {
        // Check if the fetched password matches the provided previous password
        if (getPasswordResponse.data.password === previousPassword) {
          return true; // Passwords match
        } else {
          Alert.alert('Error', 'Incorrect previous password');
          return false; // Passwords don't match
        }
      } else {
        Alert.alert('Error', 'Failed to fetch password');
        return false; // Failed to fetch password
      }
    } catch (error) {
      console.error('Error fetching password:', error);
      Alert.alert('Error', 'Failed to fetch password. Please try again later.');
      return false; // Error occurred while fetching password
    }
  };
  
  const updatePassword = async (email, newPassword) => {
    try {
      // Update password
      const updateResponse = await axios.put('http://192.168.136.1:3002/updatePassword', { email, newPassword });
    
      if (updateResponse.data.message === 'Password updated successfully') {
        return true; // Password updated successfully
      } else {
        Alert.alert('Error', 'Failed to update password');
        return false; // Failed to update password
      }
    } catch (error) {
      console.error('Error updating password:', error);
      Alert.alert('Error', 'Failed to update password. Please try again later.');
      return false; // Error occurred while updating password
    }
  };
  
  const handleDoneChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
  
    try {
      // Check if email, previousPassword, and newPassword are not empty
      if (!email || !previousPassword || !newPassword) {
        Alert.alert('Error', 'Please fill in all fields');
        return;
      }
  
      const passwordsMatch = await getPassword(email, previousPassword, newPassword);
      if (passwordsMatch) {
        const passwordUpdated = await updatePassword(email, newPassword);
        if (passwordUpdated) {
          Alert.alert(
            'Success',
            'Password updated successfully',
            [
              { text: 'OK', onPress: () => handleLogout() } // Call handleLogout when OK is pressed
            ]
          );
          handleCloseModal();
        }
      }
    } catch (error) {
      console.error('Error updating password:', error);
      Alert.alert('Error', 'Failed to update password. Please try again later.');
    }
  };
  
  
  const handleDeleteAccount = async () => {
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
                // Show warning about data deletion
                Alert.alert(
                  'Warning',
                  'Once the action is done, all your data will be deleted from the database and cannot be recovered back.',
                  [
                    {
                      text: 'Cancel',
                      style: 'cancel',
                    },
                    {
                      text: 'Confirm',
                      onPress: async () => {
                        // Proceed with profile deletion
                        try {
                          // Retrieve the user data from AsyncStorage
                          const storedDataString = await AsyncStorage.getItem('userData');
                          
                          // Parse the stored data and extract the email
                          if (storedDataString) {
                            const storedData = JSON.parse(storedDataString);
                            const userEmail = storedData.email;
                        
                            // Log the email before deletion
                            console.log('Deleting profile with email:', userEmail);
                        
                            // Make the delete request with the retrieved email
                            const response = await axios.delete(`http://192.168.136.1:3002/deleteProfile?email=${userEmail}`);
                        
                            // Handle the response if needed
                            // For example, you can check response status and display a success message
                            if (response.status === 200) {
                              Alert.alert('Success', 'Profile deleted successfully.');
                              // Navigate to the login page
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
                console.error('Error showing warning prompt:', error);
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

  const handleLogout = async () => {
    try {
      // Clear AsyncStorage
      await AsyncStorage.clear();
      // Navigate to login screen
      navigation.navigate('Application');
    } catch (error) {
      console.error('Error clearing AsyncStorage:', error);
      // Handle error
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <View style={styles.container}>
        <TouchableOpacity onPress={handleChangePassword}>
          <View style={styles.item}>
            <Icon name="password" size={20} color="#000" style={styles.icon} />
            <Text style={styles.clickableText}>Change Password</Text>
          </View>
        </TouchableOpacity>
        <Divider />
        <TouchableOpacity onPress={handleDeleteAccount}>
          <View style={styles.item}>
            <AntIcon name="deleteuser" size={20} color="#000" style={styles.icon} />
            <Text style={styles.clickableText}>Delete Account</Text>
          </View>
        </TouchableOpacity>
        <Modal
          animationType="slide"
          transparent={true}
          visible={changePasswordModalVisible}
          onRequestClose={handleCloseModal}
        >
        <KeyboardAvoidingView
          behavior="height"
          style={styles.keyboardAvoidingContainer}
        ></KeyboardAvoidingView>

          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Change Password</Text>
              <>
                <Text style={styles.passwordMessage}>
                  1. Choose a strong password and do not reuse it for other accounts.
                </Text>
                <Text style={styles.passwordMessage1}>
                  2. Changing your password will sign you out from the app. You will need to log in again
                  using your new password.
                </Text>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Previous Password</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter previous password"
                    secureTextEntry={true}
                    value={previousPassword}
                    onChangeText={(text) => setPreviousPassword(text)}
                  />
                </View>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>New Password</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter new password"
                    secureTextEntry={true}
                    value={newPassword}
                    onChangeText={(text) => setNewPassword(text)}
                  />
                </View>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Confirm New Password</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter confirmed password"
                    secureTextEntry={true}
                    value={confirmPassword}
                    onChangeText={(text) => setConfirmPassword(text)}
                  />
                </View>
                
                <Image source={changePasswordImage} style={styles.modalImage} />

                <View style={styles.buttonContainer}>
                  <TouchableOpacity onPress={handleCloseModal} style={styles.button}>
                    <Text style={styles.buttonText}>Back</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleDoneChangePassword} style={[styles.button, styles.doneButton]}>
                    <Text style={styles.buttonText}>Done</Text>
                  </TouchableOpacity>
                </View>
              </>
            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  item: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
    flexDirection: 'row',
    alignItems: 'center',
  },
  clickableText: {
    fontSize: 16,
    color: 'black',
    marginLeft: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    flex: 1,
    width: '100%',
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  modalTitle: {
    fontSize: 25,
    // fontWeight: 'bold',
    marginBottom: 10,
    color:'#4494ad',
    fontFamily: 'Courgette-Regular',
  },
  modalImage: {
    height: 200, // Adjust the height to fit your design
    width: '90%', // Adjust the width to fit your design
    alignSelf: 'center',
    resizeMode: 'contain', // Use 'contain' to fit the entire image within the specified dimensions
    marginBottom: 1, // Adjust spacing as needed
  },
  closeButton: {
    backgroundColor: '#DDDDDD',
    padding: 10,
    marginTop: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#000000',
    fontSize: 16,
    textAlign: 'center', 
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color:'black',
    fontWeight:'bold',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 10,
  },
  passwordMessage: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 10,
  },
  passwordMessage1: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 25,
  },
  buttonContainer: {
    marginTop:30,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#DDDDDD',
    padding: 10,
    borderRadius: 5,
    width: '48%',
  },
  doneButton: {
    backgroundColor: '#4494ad',
  },
  icon: {
    marginRight: 10,
  },
  scrollViewContainer: {
    flexGrow: 1,
  },
});

export default Setting;
