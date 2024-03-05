// HomeDrawerNavigator.js
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from './Screens/Home'; 
import ProfileScreen from './Screens/Profile'; 
import SettingScreen from './Screens/SettingScreen'; 

const Drawer = createDrawerNavigator();

const HomeDrawerNavigator = () => (
  <Drawer.Navigator>
    <Drawer.Screen name="Home" component={HomeScreen} />
    <Drawer.Screen name="Profile" component={ProfileScreen} />
    <Drawer.Screen name="Setting" component={SettingScreen} />
    {/* Add other screens for the drawer */}
  </Drawer.Navigator>
);

export default HomeDrawerNavigator;
