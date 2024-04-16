import React from 'react';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { Button, StyleSheet, View, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeScreen from './Screens/Home'; 
import ProfileScreen from './Screens/Profile'; 
import SettingScreen from './Screens/Setting'; 
import TermsAndConditions from './Screens/TermsAndConditions'; 
import Icon from 'react-native-vector-icons/AntDesign';


const Drawer = createDrawerNavigator();

const HomeDrawerNavigator = ({ navigation }) => {
  // Function to handle logout
  const handleLogout = async () => {
    try {
      // Clear AsyncStorage
      await AsyncStorage.clear();
      // Navigate to login screen
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error clearing AsyncStorage:', error);
      // Handle error
    }
  };

  // Custom drawer content component
  const CustomDrawerContent = (props) => (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem
        label="Logout"
        onPress={handleLogout}
        icon={({ focused, color, size }) => (
          <Icon name="logout" size={size} color={color} style={styles.drawerIcon} />
        )}
        inactiveTintColor="#FF0000" // Set text color to red
        labelStyle={styles.drawerLabel}
      />
    </DrawerContentScrollView>
  );

  return (
    <Drawer.Navigator 
      drawerContent={CustomDrawerContent}
      drawerContentOptions={{
        activeTintColor: '#4494ad', // Set active tint color
        labelStyle: styles.labelStyle, // Apply custom label style
      }}
    >
      <Drawer.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{
          drawerIcon: ({ focused, color, size }) => (
            <Icon name="home" size={size} color={color} style={styles.drawerIcon} />
          ),
          drawerLabel: ({ focused, color }) => (
            <Text style={[styles.drawerLabel, { color }]}>Home</Text>
          ),
        }} 
      />
      <Drawer.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{
          drawerIcon: ({ focused, color, size }) => (
            <Icon name="user" size={size} color={color} style={styles.drawerIcon} />
          ),
          drawerLabel: ({ focused, color }) => (
            <Text style={[styles.drawerLabel, { color }]}>Profile</Text>
          ),
        }} 
      />
      <Drawer.Screen 
        name="Setting" 
        component={SettingScreen} 
        options={{
          drawerIcon: ({ focused, color, size }) => (
            <Icon name="setting" size={size} color={color} style={styles.drawerIcon} />
          ),
          drawerLabel: ({ focused, color }) => (
            <Text style={[styles.drawerLabel, { color }]}>Setting</Text>
          ),
        }} 
      />
      <Drawer.Screen 
        name="Terms And Conditions" 
        component={TermsAndConditions} 
        options={{
          drawerIcon: ({ focused, color, size }) => (
            <Icon name="filetext1" size={size} color={color} style={styles.drawerIcon} />
          ),
          drawerLabel: ({ focused, color }) => (
            <Text style={[styles.drawerLabel, { color }]}>Terms and Conditions</Text>
          ),
        }} 
      />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  labelStyle: {
    color: '#4494ad', // Set label color to the theme color (#4494ad)
  },
  drawerIcon: {
    marginRight: 10, // Adjust icon margin if needed
  },
  drawerLabel: {
    fontFamily: 'Marker Felt', // Add your custom font here
    fontSize: 16,
    marginLeft: -15, // Adjust label margin to align with icon
  },
});

export default HomeDrawerNavigator;