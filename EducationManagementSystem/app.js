import React, { useEffect, useState, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthProvider } from './AuthContext';

import LoginPage from './Screens/LoginPage';
import SignupPage from './Screens/SignupPage';
import HomeScreen from './Screens/Home';
import HomeDrawerNavigator from './HomeDrawerNavigator';
import AddResult from './Screens/AddResult';
import ViewResult from './Screens/ViewResult';
import SearchStudent from './Screens/SearchStudent';
import StudentExamList from './Screens/StudentExamList';
import ExamDetails from './Screens/ExamDetails';
import OnlineAcademicAssistant from './Screens/OnlineAcademicAssistant';
import OnlineAskQuestion from './Screens/OnlineAskQuestion';
import OnlineAnswerQuestion from './Screens/OnlineAnswerQuestion';
import ApproveStudent from './Screens/ApproveStudent';
import ApproveTeacher from './Screens/ApproveTeacher';
import PredictForm from './Screens/PredictForm';

const Stack = createStackNavigator();

const App = () => {
  const [isReady, setIsReady] = useState(false);
  const navigationRef = useRef(null);

  useEffect(() => {
    checkLoggedInStatus();
  }, []);

  const checkLoggedInStatus = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        // User data exists, navigate to HomeDrawer directly
        navigationRef.current?.navigate('HomeDrawer');
      } else {
        // User data does not exist, mark app as ready
        setIsReady(true);
      }
    } catch (error) {
      console.error('Error checking logged in status:', error);
    }
  };

  return (
    <NavigationContainer ref={navigationRef} onReady={() => setIsReady(true)}>
      {isReady && (
        <AuthProvider>
          <Stack.Navigator initialRouteName="Login" headerMode="none">
            <Stack.Screen name="Login" component={LoginPage} />
            <Stack.Screen name="Signup" component={SignupPage} />
            <Stack.Screen name="HomeScreen" component={HomeScreen} />
            <Stack.Screen name="HomeDrawer" component={HomeDrawerNavigator} />
            <Stack.Screen name="AddResult" component={AddResult} />
            <Stack.Screen name="ViewResult" component={ViewResult} />
            <Stack.Screen name="SearchStudent" component={SearchStudent} />
            <Stack.Screen name="StudentExamList" component={StudentExamList} />
            <Stack.Screen name="ExamDetails" component={ExamDetails} />
            <Stack.Screen name="OnlineAcademicAssistant" component={OnlineAcademicAssistant} />
            <Stack.Screen name="OnlineAskQuestion" component={OnlineAskQuestion} />
            <Stack.Screen name="OnlineAnswerQuestion" component={OnlineAnswerQuestion} />
            <Stack.Screen name="ApproveStudent" component={ApproveStudent} />
            <Stack.Screen name="ApproveTeacher" component={ApproveTeacher} />
            <Stack.Screen name="PredictForm" component={PredictForm} />
          </Stack.Navigator>
        </AuthProvider>
      )}
    </NavigationContainer>
  );
};

export default App;
