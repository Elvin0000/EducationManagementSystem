import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginPage from './Screens/LoginPage';
import SignupPage from './Screens/SignupPage';
import Home from './Screens/Home';
import AddResult from './Screens/AddResult';
import ExamResult from './Screens/ExamResult';

const Stack = createStackNavigator();

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleSignupSuccess = () => {
    setIsLoggedIn(true);
  };

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={isLoggedIn ? 'Home' : 'Login'} headerMode="none">
        <Stack.Screen name="Login">
          {(props) => <LoginPage {...props} onLoginSuccess={handleLoginSuccess} />}
        </Stack.Screen>
        <Stack.Screen name="Signup">
          {(props) => <SignupPage {...props} onSignupSuccess={handleSignupSuccess} />}
        </Stack.Screen>
        {isLoggedIn && (
          <>
            <Stack.Screen name="Home" component={Home} options={{ title: 'Home' }} />
            <Stack.Screen name="AddResult" component={AddResult} options={{ title: 'Add Result' }} />
            <Stack.Screen name="ExamResult" component={ExamResult} options={{ title: 'Exam Result' }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
