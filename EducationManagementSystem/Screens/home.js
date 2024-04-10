import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card, Button } from 'react-native-paper'; 
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Home = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDataString = await AsyncStorage.getItem('userData');
        if (userDataString) {
          const userData = JSON.parse(userDataString);
          setUserData(userData);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  if (!userData) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const handleAddResult = () => {
    navigation.navigate('AddResult');
  };

  const handleSearchStudent = () => {
    navigation.navigate('SearchStudent');
  };

  const handleOnlineAcademicAssistant = () => {
    navigation.navigate('OnlineAcademicAssistant');
  };

  const handleApproveStudent = () => {
    navigation.navigate('ApproveStudent');
  };

  const handleApproveTeacher = () => {
    navigation.navigate('ApproveTeacher');
  };

  const handleViewResult = () => {
    navigation.navigate('ViewResult');
  };

  const handlePredictResult = () => {
    navigation.navigate('PredictResult');
  };

  const handleAnnouncement = () => {
    navigation.navigate('Announcement');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Education Management System</Text>

      {(userData.admin === 1 || userData.teacher === 1) && (
        <Card style={styles.card}>
          <Card.Content>
            <Button onPress={handleAddResult}>Add Exam Results</Button>
          </Card.Content>
        </Card>
      )}

      {userData.student === 1 && (
        <Card style={styles.card}>
          <Card.Content>
            <Button onPress={handleViewResult}>View Exam Result</Button>
          </Card.Content>
        </Card>
      )}

      {(userData.admin === 1 || userData.teacher === 1)&& (
        <Card style={styles.card}>
          <Card.Content>
            <Button onPress={handleSearchStudent}>Manage Exam Results</Button>
          </Card.Content>
        </Card>
      )}

      {(userData.student === 1 || userData.admin === 1 || userData.teacher === 1) && (
        <Card style={styles.card}>
          <Card.Content>
            <Button onPress={handleOnlineAcademicAssistant}>Online Academic Assistant</Button>
          </Card.Content>
        </Card>
      )}

      {(userData.admin === 1 || userData.teacher === 1) && (
        <Card style={styles.card}>
          <Card.Content>
            <Button onPress={handleApproveStudent}>Approve Student</Button>
          </Card.Content>
        </Card>
      )}

      {userData.admin === 1 && (
        <Card style={styles.card}>
          <Card.Content>
            <Button onPress={handleApproveTeacher}>Approve Teacher</Button>
          </Card.Content>
        </Card>
      )}

      {userData.student === 1 && (
        <Card style={styles.card}>
          <Card.Content>
            <Button onPress={handlePredictResult}>PredictResult</Button>
          </Card.Content>
        </Card>
      )}

      {(userData.student === 1 || userData.admin === 1 || userData.teacher === 1) && (
        <Card style={styles.card}>
          <Card.Content>
            <Button onPress={handleAnnouncement}>Announcement</Button>
          </Card.Content>
        </Card>
      )}

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color:"#4494ad",
    textAlign: 'center',
  },
  card: {
    marginBottom: 15,
    width: '80%', 
  },
});

export default Home;
