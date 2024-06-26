import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, BackHandler, Image} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import loginImage from '../assets/application/loginImage.jpg';

export default class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      isLoginScreen: true, // Keep track of whether the user is on the login screen
    };
  }

  componentDidMount() {
    // Clear the form when the component mounts
    this.clearForm();
    // Add event listener for hardware back button press
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonPress);
  
    // Add listener to prevent back action when on HomeScreen
    this.backListener = this.props.navigation.addListener('beforeRemove', (e) => {
      if (this.props.navigation.isFocused() && !this.state.isLoginScreen) {
        e.preventDefault();
      }
    });
  }
  

  componentWillUnmount() {
    // Remove event listener when component unmounts
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonPress);

    // Remove back listener
    this.backListener();
  }

  clearForm = () => {
    this.setState({
      email: '',
      password: '',
    });
  };

  handleLogin = async () => {
    const { email, password } = this.state;
  
    // Validate email and password
    if (!email || !password) {
      Alert.alert('Error', 'Both email and password are required.');
      return;
    }
  
    try {
      // Make a POST request to your server
      const response = await axios.post('http://192.168.136.1:3002/login', {
        email: this.state.email,
        password: this.state.password,
      });
  
      // Handle the response from the server
      if (response.data.success) {
        // Authentication successful, fetch user details
        try {
          const userDetailsResponse = await axios.get(`http://192.168.136.1:3002/userDetails?email=${email}`);
          const { student, teacher, admin, parent, selectedRole } = userDetailsResponse.data.userDetails;
  
          // Store user data in AsyncStorage
          const userData = {
            email: email,
            student: student,
            teacher: teacher,
            admin: admin,
            parent: parent,
            selectedRole: selectedRole,
          };
          await AsyncStorage.setItem('userData', JSON.stringify(userData));
  
          // Set isLoggedIn flag to true in AsyncStorage to indicate user session
          await AsyncStorage.setItem('isLoggedIn', 'true');
  
          // Log user data from AsyncStorage
          this.debugAsyncStorage();
        } catch (error) {
          console.error('Error fetching user details or storing data in AsyncStorage:', error);
        }
  
        // Replace the current screen with the 'HomeDrawer' navigator
        this.props.navigation.replace('HomeDrawer');
  
        // Clear the form
        this.clearForm();
      } else {
        // Authentication failed, display an error message
        if (response.status === 401) {
          Alert.alert('Error', 'Email or password is incorrect.');
        } else {
          Alert.alert('Error', 'Email or password is incorrect.');
        }
      }
    } catch (error) {
      console.error('Error during login:', error);
      // Handle other types of errors (network, server, etc.)
      Alert.alert('Error', 'Email or password is incorrect.');
    }
  };
  
  debugAsyncStorage = async () => {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      const allItems = await AsyncStorage.multiGet(allKeys);
      console.log('All AsyncStorage keys:', allItems);
    } catch (error) {
      console.error('Error debugging AsyncStorage:', error);
    }
  };

  // Handle hardware back button press
  handleBackButtonPress = () => {
    const routeName = this.props.navigation.getState().routes.slice(-1)[0].name;
    // Check if the current screen is the home screen
    if (this.props.navigation.isFocused() && routeName === 'HomeScreen') {
      // If on the home screen, prevent navigating back
      return true;
    }
    // For other screens, allow navigating back
    return false;
  };

  render() {
    const { navigation } = this.props;
    const { email, password } = this.state;

    return (
      <View style={styles.container}>
        {/* Single Image */}
        {/* <Image source={loginImage} style={styles.singleImage} /> */}

        {/* Login Form */}
        <View style={styles.loginFormContainer}>
        <Image source={loginImage} style={styles.singleImage} />
          <Text style={styles.heading}>Login</Text>

          <TextInput
            style={styles.input}
            placeholder="User Email"
            placeholderTextColor="#36a890" // Set the color of the placeholder text
            value={email}
            onChangeText={(text) => this.setState({ email: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#36a890" // Set the color of the placeholder text
            value={password}
            onChangeText={(text) => this.setState({ password: text })}
            secureTextEntry
            placeholderStyle={styles.placeholderStyle}
          />
          <TouchableOpacity style={styles.button} onPress={this.handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white', // Set background color to white
  },
  singleImage: {
    height: 200, // Adjust the height to your desired size
    width: '90%', // Adjust the width as needed
    alignSelf: 'center',
    resizeMode: 'contain', // Use 'contain' to fit the entire image within the specified dimensions
    marginBottom:15,
  },
  
  loginFormContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  heading: {
    fontSize: 24,
    marginBottom: 35,
    color:'#36a890',
    fontWeight:'bold',
  },
  input: {
    width: '90%',
    height: 40,
    borderColor: '#36a890',
    borderWidth: 2,
    marginBottom: 10,
    marginLeft: 30,
    marginRight: 30,
    paddingLeft: 40, // Adjust the paddingLeft to make space for the placeholder text
    borderRadius: 50, // Set borderRadius to apply rounded corners
  },
  
  placeholderStyle: {
    marginLeft: 100, // Adjust the left margin of the placeholder text
  },
  
  button: {
    width: '90%',
    backgroundColor: '#36a890',
    padding: 10,
    alignItems: 'center',
    borderRadius: 50,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});
