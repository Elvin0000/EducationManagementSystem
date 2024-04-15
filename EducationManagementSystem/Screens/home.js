import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card, Button, Title } from 'react-native-paper'; // Import Title from react-native-paper
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import academicAssistantImage from '../assets/academicAssistantImage.webp';
import announcementImage from '../assets/announcementImage.jpg';
import approveImage1 from '../assets/approveImage1.webp';
import approveImage2 from '../assets/approveImage2.png';
import approveImage3 from '../assets/approveImage3.jpg';
import manageResultImage2 from '../assets/manageResultImage2.jpeg';
import viewExamResultImage from '../assets/viewExamResultImage.jpeg';
import viewResultImage from '../assets/viewResultImage.jpg';
import examResultImage from '../assets/examResultImage.jpg';
import predictImage from '../assets/predictImage.jpg';

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

  const renderCard = (title, description, imageSource, actionButtons) => {
    return (
      <Card style={styles.card}>
        <Card.Cover source={imageSource} style={styles.cardCover} />
        <Card.Content style={styles.cardContent}>
          <Text><Title>{title}</Title></Text> 
          <Text variant="bodyMedium">{description}</Text>
        </Card.Content>
        <Card.Actions style={styles.cardActions}>
          {actionButtons.map((button, index) => (
            <Button key={index} onPress={button.onPress}>{button.label}</Button>
          ))}
        </Card.Actions>
      </Card>
    );
  };
  

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome to Education Management System</Text>

        {(userData.admin === 1 || userData.teacher === 1) && renderCard(
          "Add Exam Results",
          "This function allows you to add exam results to the system.",
          examResultImage,
          [{ label: "Go", onPress: handleAddResult }]
        )}

        {userData.student === 1 && renderCard(
          "View Exam Result",
          "This function enables you to view exam results stored in the system.",
          viewResultImage,
          [ { label: "Go", onPress: handleViewResult }]
        )}

        {(userData.admin === 1 || userData.teacher === 1) && renderCard(
          "Manage Exam Results",
          "With this function, you can manage and search for specific exam results.",
          manageResultImage2,
          [ { label: "Go", onPress: handleSearchStudent }]
        )}

        {(userData.student === 1 || userData.admin === 1 || userData.teacher === 1) && renderCard(
          "Online Academic Assistant",
          "Access the online academic assistant to get help with various academic tasks.",
          academicAssistantImage,
          [ { label: "Go", onPress: handleOnlineAcademicAssistant }]
        )}

        {(userData.admin === 1 || userData.teacher === 1) && renderCard(
          "Approve Student",
          "Use this function to approve student registrations.",
          approveImage1,
          [ { label: "Go", onPress: handleApproveStudent }]
        )}

        {userData.admin === 1 && renderCard(
          "Approve Teacher",
          "Approve teacher registrations using this function.",
          approveImage2,
          [ { label: "Go", onPress: handleApproveTeacher }]
        )}

        {userData.student === 1 && renderCard(
          "Predict Result",
          "Predict exam results based on historical data and trends.",
          predictImage,
          [ { label: "Go", onPress: handlePredictResult }]
        )}

        {(userData.student === 1 || userData.admin === 1 || userData.teacher === 1) && renderCard(
          "Announcement",
          "View announcements and important updates from the education management system.",
          announcementImage,
          [ { label: "Go", onPress: handleAnnouncement }]
        )}
        
      </View>
    </ScrollView>
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
    color: "#4494ad",
    textAlign: 'center',
  },
  card: {
    marginBottom: 15,
    width: 300,
    height: 300,
  },
  cardCover: {
    height: '50%',
  },
  cardContent: {
    paddingTop: 10,
  },
  cardActions: {
    justifyContent: 'flex-end',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Home;
