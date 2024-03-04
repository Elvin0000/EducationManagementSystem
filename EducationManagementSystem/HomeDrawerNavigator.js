// HomeDrawerNavigator.js
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from './Screens/Home'; // Adjust the import based on your file structure

const Drawer = createDrawerNavigator();

const HomeDrawerNavigator = () => (
  <Drawer.Navigator>
    <Drawer.Screen name="Home" component={HomeScreen} />
    {/* Add other screens for the drawer */}
  </Drawer.Navigator>
);

export default HomeDrawerNavigator;
