import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './home';
import AddResult from './AddResult';
import ExamResult from './ExamResult';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} options={{ title: 'Home' }} />
        <Stack.Screen name="AddResult" component={AddResult} options={{ title: 'Add Result' }} />
        <Stack.Screen name="ExamResult" component={ExamResult} options={{ title: 'Exam Result' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
