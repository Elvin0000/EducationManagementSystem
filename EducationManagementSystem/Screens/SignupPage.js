import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const SignupPage = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('student');

  const handleRoleChange = (selectedRole) => {
    setSelectedRole(selectedRole);
  };

  const handleSignup = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Both email, password, and confirm password cannot be empty.');
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
        // Signup successful, navigate to home page or perform other actions
        console.log('User signed up successfully:', data);
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
      <Text style={styles.heading}>Signup</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={(text) => setConfirmPassword(text)}
        secureTextEntry
      />
      <Text>Select your account:</Text>
      <TouchableOpacity
        style={[styles.roleButton, selectedRole === 'student' && { backgroundColor: 'lightblue' }]}
        onPress={() => handleRoleChange('student')}
      >
        <Text>Student</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.roleButton, selectedRole === 'teacher' && { backgroundColor: 'lightblue' }]}
        onPress={() => handleRoleChange('teacher')}
      >
        <Text>Teacher</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Signup</Text>
      </TouchableOpacity>
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
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
  },
  roleButton: {
    marginBottom: 10,
  },
  button: {
    width: '100%',
    backgroundColor: 'blue',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default SignupPage;