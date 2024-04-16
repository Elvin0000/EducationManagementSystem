import React from 'react';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeScreen from './Screens/Home'; 
import ProfileScreen from './Screens/Profile'; 
import SettingScreen from './Screens/Setting'; 
import TermsAndConditions from './Screens/TermsAndConditions'; 

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

  return (
    <Drawer.Navigator 
      drawerContent={(props) => (
        <DrawerContentScrollView {...props}>
          <DrawerItemList {...props} />
          <DrawerItem
            label="Logout"
            onPress={handleLogout}
            inactiveTintColor="#FF0000" // Set text color to red
          />
        </DrawerContentScrollView>
      )}
      drawerContentOptions={{
        activeTintColor: '#4494ad', // Set active tint color
        labelStyle: styles.labelStyle, // Apply custom label style
      }}
    >
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Profile" component={ProfileScreen} />
      <Drawer.Screen name="Setting" component={SettingScreen} />
      <Drawer.Screen name="Terms And Conditions" component={TermsAndConditions} />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  labelStyle: {
    color: '#4494ad', // Set label color to the theme color (#4494ad)
  },
});

export default HomeDrawerNavigator;
