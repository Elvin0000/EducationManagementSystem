import React from 'react';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeScreen from './Screens/Home'; 
import ProfileScreen from './Screens/Profile'; 
import SettingScreen from './Screens/SettingScreen'; 

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
    <Drawer.Navigator drawerContent={(props) => (
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
        <DrawerItem
          label="Logout"
          onPress={handleLogout}
          inactiveTintColor="#000000"
        />
      </DrawerContentScrollView>
    )}>
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Profile" component={ProfileScreen} />
      <Drawer.Screen name="Setting" component={SettingScreen} />
    </Drawer.Navigator>
  );
};

export default HomeDrawerNavigator;
