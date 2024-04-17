import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RadioButton } from 'react-native-paper';
import signupImage from '../assets/application/signupImage.jpg'; // Import the signup image

const SignupPage = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('student');

  const handleRoleChange = (selectedRole) => {
    setSelectedRole(selectedRole);
  };

  const isEmailValid = (email) => {
    // Regular expression to validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSignup = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Both email, password, and confirm password cannot be empty.');
      return;
    }

    if (!isEmailValid(email)) {
      Alert.alert('Error', 'Please enter a valid email address.');
      return;
    }
  
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Password and confirm password do not match');
      return;
    }
  
    try {
      const response = await fetch('http://192.168.136.1:3002/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          selectedRole,
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // Signup successful, store user data in AsyncStorage
        const userData = {
          email: email,
          student: 0,
          teacher: 0,
          admin: 0,
          selectedRole: selectedRole,
        };
        await AsyncStorage.setItem('userData', JSON.stringify(userData));
  
        // Log user data from AsyncStorage
        console.log('User data stored in AsyncStorage:', userData);
  
        // Navigate to the 'HomeDrawer' navigator
        navigation.navigate('HomeDrawer');
      } else {
        // Signup failed, display error message
        Alert.alert('Error', data.message);
      }
    } catch (error) {
      console.error('Error during signup:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again later.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Image */}
      <Image source={signupImage} style={styles.singleImage} />

      {/* Signup Form */}
      <View style={styles.signupFormContainer}>
        <Text style={styles.heading}>Signup</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#8b228f" 
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#8b228f" 
          value={password}
          onChangeText={(text) => setPassword(text)}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor="#8b228f" 
          value={confirmPassword}
          onChangeText={(text) => setConfirmPassword(text)}
          secureTextEntry
        />
        <View style={styles.container1}>
          <Text style={styles.selectText}>Select your account:</Text>
          <View style={styles.roleContainer}>
            <View style={styles.roleButtonContainer}>
              <RadioButton
                value="student"
                status={selectedRole === 'student' ? 'checked' : 'unchecked'}
                onPress={() => handleRoleChange('student')}
                color="#8b228f" // Set RadioButton color
              />
              <Text style={styles.roleText}>Student</Text>
            </View>
            <View style={styles.roleButtonContainer}>
              <RadioButton
                value="teacher"
                status={selectedRole === 'teacher' ? 'checked' : 'unchecked'}
                onPress={() => handleRoleChange('teacher')}
                color="#8b228f" // Set RadioButton color
              />
              <Text style={styles.roleText}>Teacher</Text>
            </View>
            <View style={styles.roleButtonContainer}>
              <RadioButton
                value="parent"
                status={selectedRole === 'parent' ? 'checked' : 'unchecked'}
                onPress={() => handleRoleChange('parent')}
                color="#8b228f" // Set RadioButton color
              />
              <Text style={styles.roleText}>Parent</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleSignup}>
            <Text style={styles.buttonText}>Signup</Text>
          </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white', // Set background color to white
  },
  container1: {
    justifyContent: 'center',
    alignItems: 'left',
    backgroundColor: 'white',
  },
  singleImage: {
    height: 200, // Adjust the height to your desired size
    width: '90%', // Adjust the width as needed
    alignSelf: 'center',
    resizeMode: 'contain', // Use 'contain' to fit the entire image within the specified dimensions
    marginBottom: 5,
  },
  signupFormContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  heading: {
    fontSize: 24,
    marginBottom: 20,
    color:'#8b228f',
    fontWeight:'bold',
  },
  input: {
    width: 250,
    height: 40,
    borderColor: '#8b228f',
    borderWidth: 2,
    marginBottom: 10,
    marginLeft: 30,
    marginRight: 30,
    paddingLeft: 40, // Adjust the paddingLeft to make space for the placeholder text
    borderRadius: 50, // Set borderRadius to apply rounded corners
  },
  roleButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  button: {
    width: 250, // Set a fixed width for the button
    backgroundColor: '#8b228f',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  selectText: {
    fontSize: 16,
    color: '#8b228f',
    fontWeight:'bold',
    marginBottom: 10,
  },
  roleContainer: {
    width: '80%',
  },
  roleText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#8b228f',
  },
});

export default SignupPage;
