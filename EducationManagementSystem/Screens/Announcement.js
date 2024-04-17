import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Searchbar, Divider } from 'react-native-paper';
import CustomHeader from '../Components/CustomHeader';

const Announcement = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [userData, setUserData] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const navigation = useNavigation();

  const fetchAnnouncements = async () => {
    try {
      const response = await axios.get('http://192.168.136.1:3002/announcements');
      setAnnouncements(response.data);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    }
  };

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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year} ${month} ${day}`;
  };

  const filterAnnouncements = () => {
    return announcements.filter(announcement =>
      announcement.announcement_text.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const handleAnnouncementPress = async (announcement) => {
    try {
      const userEmail = userData.email;
      console.log('User Email:', userEmail);
      console.log('Announced By:', announcement.announced_by);

      if (userEmail === announcement.announced_by) {
        navigation.navigate('ManageAnnouncement', { announcement });
      } else {
        console.warn('You are not authorized to manage this announcement.');
      }
    } catch (error) {
      console.error('Error checking user authorization:', error);
    }
  };

  const handleAddAnnouncement = () => {
    navigation.navigate('AddAnnouncement');
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleAnnouncementPress(item)}>
      <View style={styles.announcementContainer}>
        <Text style={styles.bold}>{item.announcement_text}</Text>
        <View style={styles.infoContainer}>
          <Text>{item.announced_by}</Text>
          <Text>{formatDate(item.announced_at)}</Text>
        </View>
        <Divider style={styles.divider} />
      </View>
    </TouchableOpacity>
  );

  useFocusEffect(
    useCallback(() => {
      fetchAnnouncements();
      fetchUserData();
    }, [])
  );

  return (
    <View style={styles.container}>
        <CustomHeader />
        {/* Use Searchbar */}
        <Searchbar
          placeholder="Search announcements"
          onChangeText={setSearchTerm}
          value={searchTerm}
          style={styles.searchBar}
        />
        <FlatList
            data={filterAnnouncements()}
            renderItem={renderItem}
            keyExtractor={(item) => item.announcement_id.toString()}
        />
        {userData.admin === 1 || userData.teacher === 1 ? (
            <TouchableOpacity style={styles.addButton} onPress={handleAddAnnouncement}>
            <Text style={styles.addButtonText}> + Announcement</Text>
            </TouchableOpacity>
        ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  announcementContainer: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
  },
  bold: {
    fontWeight: 'bold',
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  searchBar: {
    marginTop: 10,
    marginBottom: 10,
    padding: 3,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 50,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#4494ad',
    padding: 10,
    borderRadius: 5,
    elevation: 5,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
  },
  divider: {
    marginVertical: 5,
    backgroundColor: '#ccc',
    
  },
});

export default Announcement;
