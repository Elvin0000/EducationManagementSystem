import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import axios from 'axios';
import CustomHeader from '../Components/CustomHeader';

const ManageAnnouncement = ({ route, navigation }) => {
  const { announcement: initialAnnouncement } = route.params;
  const [announcement, setAnnouncement] = useState(initialAnnouncement);
  const [editMode, setEditMode] = useState(false);
  const [editedText, setEditedText] = useState(announcement.announcement_text);

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleSave = async () => {
    try {
      // Make API call to update the announcement with edited text
      const response = await axios.put(`http://192.168.136.1:3002/announcements/${announcement.announcement_id}`, {
        announcement_text: editedText,
      });
      if (response.data.success) {
        // Update announcement in local state with edited text
        setAnnouncement({ ...announcement, announcement_text: editedText });
        setEditMode(false);
        
        // Display success message
        Alert.alert('Success', 'Announcement updated successfully');
      } else {
        console.error('Failed to update announcement:', response.data.message);
      }
    } catch (error) {
      console.error('Error updating announcement:', error);
    }
  };
  

  const handleDelete = async () => {
    try {
      // Prompt the user to confirm before deleting
      Alert.alert(
        'Confirm Deletion',
        'Are you sure you want to delete this announcement?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Delete',
            onPress: async () => {
              const response = await axios.delete(`http://192.168.136.1:3002/announcements/${announcement.announcement_id}`);
              if (response.data.success) {
                // Handle success, such as navigating back to the previous screen
                navigation.goBack();
                // Display success message
                Alert.alert('Success', 'Announcement deleted successfully');
              } else {
                console.error('Failed to delete announcement:', response.data.message);
              }
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error deleting announcement:', error);
    }
  };
  

  const handleCancelEdit = () => {
    // Reset edited text and exit edit mode
    setEditedText(announcement.announcement_text);
    setEditMode(false);
  };

  const handleChangeText = (text) => {
    setEditedText(text);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <View style={styles.container}>
      <CustomHeader title="Manage Announcement" />
      <View style={styles.announcementContainer}>
        {editMode ? (
          <TextInput
            style={styles.editTextInput}
            value={editedText}
            onChangeText={handleChangeText}
            autoFocus
          />
        ) : (
          <Text style={styles.bold}>{announcement.announcement_text}</Text>
        )}
        <View style={styles.infoContainer}>
          <Text>{announcement.announced_by}</Text>
          <Text>{formatDate(announcement.announced_at)}</Text>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        {editMode ? (
          <>
            <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSave}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleCancelEdit}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity style={[styles.button, styles.editButton]} onPress={handleEdit}>
              <Text style={styles.buttonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleDelete}>
              <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
      <TouchableOpacity style={styles.doneButton} onPress={() => navigation.goBack()}>
        <Text style={styles.doneButtonText}>Done</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  announcementContainer: {
    marginTop:20,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 20,
  },
  bold: {
    fontWeight: 'bold',
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  editTextInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    marginTop:20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    elevation: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  editButton: {
    backgroundColor: '#4494ad',
  },
  deleteButton: {
    backgroundColor: 'red',
  },
  saveButton: {
    backgroundColor: 'green',
  },
  cancelButton: {
    backgroundColor: 'gray',
  },
  doneButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#4494ad',
    padding: 10,
    borderRadius: 5,
    elevation: 5,
  },
  doneButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default ManageAnnouncement;
