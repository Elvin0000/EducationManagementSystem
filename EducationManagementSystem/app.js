// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginPage from './Screens/LoginPage';
import SignupPage from './Screens/SignupPage';
import AddResult from './Screens/AddResult';
import ViewStudentList from './Screens/ViewStudentList';
import HomeDrawerNavigator from './HomeDrawerNavigator';
import { AuthProvider } from './AuthContext';

const Stack = createStackNavigator();

const App = () => {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login" headerMode="none">
          <Stack.Screen name="Login" component={LoginPage} />
          <Stack.Screen name="Signup" component={SignupPage} />
          <Stack.Screen name="HomeDrawer" component={HomeDrawerNavigator} />
          <Stack.Screen name="AddResult" component={AddResult} />
          <Stack.Screen name="ViewStudentList" component={ViewStudentList} />
          {/* Add screens for other actions if needed */}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
};

export default App;