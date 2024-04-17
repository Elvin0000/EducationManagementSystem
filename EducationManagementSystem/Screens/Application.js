import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, BackHandler, ImageBackground } from 'react-native';
import { Carousel } from 'react-native-ui-lib';

import wallpaper from '../assets/application/wallpaper.jpg'; 


export default class Application extends Component {
  componentDidMount() {
    // Add event listener for hardware back button press
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonPress);
  
    // Add listener to prevent back action when on HomeScreen
    this.backListener = this.props.navigation.addListener('beforeRemove', (e) => {
      if (this.props.navigation.isFocused()) {
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

    return (
      <ImageBackground source={wallpaper} style={styles.backgroundImage}>
        <View style={styles.container}>
          {/* Title */}
          <Text style={styles.title}>Education Management System</Text>

          {/* Carousel */}
          <Carousel 
            containerStyle={styles.carouselContainer} 
            loop 
            autoplay 
            autoplayInterval={3000}
          >
            {/* Your carousel images */}
          </Carousel>

          <View style={styles.loginFormContainer}>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Signup')}>
              <Text style={styles.buttonText}>Signup</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // or 'stretch' or 'contain'
  },
  container: {
    flex: 1,
  },
  title: {
    fontFamily: 'Satisfy-Regular',
    fontSize: 40,
    color: 'white',
    textAlign: 'center',
    marginTop: 125,
  },
  carouselContainer: {
    height: 200,
    marginBottom: 20,
  },
  loginFormContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  button: {
    width: '80%',
    backgroundColor: '#4494ad',
    padding: 12,
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 15,
    borderRadius:50,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight:'bold',
    fontFamily:'Quicksand-bold',
  },
});

