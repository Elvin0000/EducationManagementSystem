// SelectAvatar.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Avatar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const SelectAvatar = () => {
  const navigation = useNavigation();
  const [selectedAvatar, setSelectedAvatar] = useState(null);

  const avatars = [
    require('../assets/avatar/avatar1.png'),
    require('../assets/avatar/avatar2.png'),
    require('../assets/avatar/avatar3.png'),
    require('../assets/avatar/avatar4.png'),
    require('../assets/avatar/avatar5.png'),
    require('../assets/avatar/avatar6.png'),
    require('../assets/avatar/avatar7.png'),
    require('../assets/avatar/avatar8.png'),
    require('../assets/avatar/avatar9.png'),
    require('../assets/avatar/avatar10.png'),
  ];

  const handleAvatarSelection = (avatarPath) => {
    setSelectedAvatar(avatarPath);
  };

  const handleSaveAvatar = () => {
    navigation.navigate('Profile', { selectedAvatar });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Select Avatar</Text>
      <View style={styles.avatarContainer}>
        {avatars.map((avatar, index) => (
          <TouchableOpacity key={index} onPress={() => handleAvatarSelection(avatar)}>
            <Avatar.Image size={100} source={avatar} style={[styles.avatar, selectedAvatar === avatar && styles.selectedAvatar]} />
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity style={styles.saveButton} onPress={handleSaveAvatar}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  heading: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#4494ad',
  },
  avatarContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  avatar: {
    margin: 10,
  },
  selectedAvatar: {
    borderWidth: 2,
    borderColor: '#4494ad',
  },
  saveButton: {
    marginTop: 20,
    backgroundColor: '#4494ad',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default SelectAvatar;
