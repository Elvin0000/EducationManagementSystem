import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { Card, Button, Title } from 'react-native-paper'; // Import Title from react-native-paper
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Carousel } from 'react-native-ui-lib';

import academicAssistantImage from '../assets/home/academicAssistantImage.webp';
import announcementImage from '../assets/home/announcementImage.jpg';
import approveImage1 from '../assets/home/approveImage1.webp';
import approveImage2 from '../assets/home/approveImage2.png';
import approveImage3 from '../assets/home/approveImage3.jpg';
import manageResultImage2 from '../assets/home/manageResultImage2.jpeg';
import viewResultImage from '../assets/home/result2.jpg';
import examResultImage from '../assets/home/examResultImage.jpg';
import predictImage from '../assets/home/predictImage.jpg';

import edu1 from '../assets/carousel/edu1.jpg';
import edu3 from '../assets/carousel/edu3.jpg';
import edu4 from '../assets/carousel/edu4.jpg';
import edu5 from '../assets/carousel/edu5.jpg';
import edu6 from '../assets/carousel/edu6.jpg';
import edu7 from '../assets/carousel/edu7.jpg';
import edu8 from '../assets/carousel/edu8.webp';
import edu9 from '../assets/carousel/edu9.jpg';
import edu10 from '../assets/carousel/edu10.jpeg';
import edu11 from '../assets/carousel/edu11.jpg';
import edu12 from '../assets/carousel/edu12.jpg';
import edu13 from '../assets/carousel/edu13.jpeg';
import edu14 from '../assets/carousel/edu14.jpeg';
import edu15 from '../assets/carousel/edu15.jpeg';
import edu16 from '../assets/carousel/edu16.jpg';
import edu17 from '../assets/carousel/edu17.jpeg';
import edu18 from '../assets/carousel/edu18.jpeg';
import edu19 from '../assets/carousel/edu19.png';
import edu20 from '../assets/carousel/edu20.jpg';
import edu21 from '../assets/carousel/edu21.webp';

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

  const handleApproveParent = () => {
    navigation.navigate('ApproveParent');
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
            <Button key={index} onPress={button.onPress} style={styles.actionButton} labelStyle={styles.buttonLabel}>
              {button.label}
            </Button>
          ))}
        </Card.Actions>
      </Card>
    );
  };
  
  

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
      <Carousel 
        containerStyle={styles.carouselContainer} 
        loop 
        autoplay 
        autoplayInterval={3000}
      >
        <Image source={edu1} style={styles.carouselImage} />
        <Image source={edu4} style={styles.carouselImage} />
        <Image source={edu9} style={styles.carouselImage} />
        <Image source={edu10} style={styles.carouselImage} />
        <Image source={edu11} style={styles.carouselImage} />
        <Image source={edu12} style={styles.carouselImage} />
        <Image source={edu13} style={styles.carouselImage} />
        <Image source={edu14} style={styles.carouselImage} />
        <Image source={edu15} style={styles.carouselImage} />
        <Image source={edu16} style={styles.carouselImage} />
        <Image source={edu17} style={styles.carouselImage} />
        <Image source={edu18} style={styles.carouselImage} />
        <Image source={edu19} style={styles.carouselImage} />
      </Carousel>

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

        {(userData.admin === 1 || userData.teacher === 1|| userData.parent === 1) && renderCard(
          "Manage Exam Results",
          "With this function, you can manage and search for specific exam results.",
          manageResultImage2,
          [ { label: "Go", onPress: handleSearchStudent }]
        )}

        {(userData.student === 1 || userData.admin === 1 || userData.teacher === 1|| userData.parent === 1) && renderCard(
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

        {(userData.admin === 1 || userData.teacher === 1) && renderCard(
          "Approve Parent",
          "Use this function to approve parent registrations.",
          approveImage3,
          [ { label: "Go", onPress: handleApproveParent }]
        )}

        {userData.admin === 1 && renderCard(
          "Approve Teacher",
          "Approve teacher registrations using this function.",
          approveImage2,
          [ { label: "Go", onPress: handleApproveTeacher }]
        )}

        {(userData.student === 1 || userData.parent === 1 || userData.admin === 1) && renderCard(
          "Predict Result",
          "Predict exam results based on historical data and trends.",
          predictImage,
          [ { label: "Go", onPress: handlePredictResult }]
        )}

        {(userData.student === 1 || userData.admin === 1 || userData.teacher === 1 || userData.parent === 1) && renderCard(
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
    fontSize: 27,
    // fontWeight: 'bold',
    marginBottom: 20,
    color: "#4494ad",
    textAlign: 'center',
    fontFamily: 'Courgette-Regular',
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
  carouselContainer: {
    height: 180,
    marginBottom: 20,
  },
  carouselImage: {
    flex: 1,
    resizeMode: 'cover',
    width: '100%',
    height: '80%',
  },
  actionButton: {
    backgroundColor: '#4494ad',
    marginRight: 10, // Adjust margin as needed
  },
  buttonLabel: {
    color: 'white',
    fontWeight:'bold',
  },
  
  
});

export default Home;
