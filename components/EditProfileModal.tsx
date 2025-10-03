import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

interface EditProfileModalProps {
  visible: boolean;
  onClose: () => void;
  onProfileImageChange?: (imageUri: string) => void;
  initialProfileImage?: string | null;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ 
  visible, 
  onClose, 
  onProfileImageChange,
  initialProfileImage 
}) => {
  const [profileImage, setProfileImage] = useState<string | null>(initialProfileImage || null);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [age, setAge] = useState('');
  const [location, setLocation] = useState('');

  const requestPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (cameraStatus !== 'granted' || mediaStatus !== 'granted') {
        Alert.alert(
          'Permissions Required',
          'Please grant camera and photo library permissions to change your profile photo.',
          [{ text: 'OK' }]
        );
        return false;
      }
    }
    return true;
  };

  const showImageOptions = () => {
    Alert.alert(
      'Profile Photo',
      'Choose how you would like to set your profile photo',
      [
        {
          text: 'Take Photo',
          onPress: takePhoto,
        },
        {
          text: 'Choose from Gallery',
          onPress: pickImage,
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  const takePhoto = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const newImageUri = result.assets[0].uri;
        setProfileImage(newImageUri);
        onProfileImageChange?.(newImageUri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  const pickImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const newImageUri = result.assets[0].uri;
        setProfileImage(newImageUri);
        onProfileImageChange?.(newImageUri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to select image. Please try again.');
    }
  };

  const handleSave = () => {
    // Here you would typically save the profile data to your backend
    Alert.alert(
      'Profile Updated',
      'Your profile has been saved successfully!',
      [{ text: 'OK', onPress: onClose }]
    );
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#2c3e50" />
          </TouchableOpacity>
          <ThemedText type="title" style={styles.title}>Edit Profile</ThemedText>
          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <ThemedText style={styles.saveText}>Save</ThemedText>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Profile Photo Section */}
          <View style={styles.photoSection}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>Profile Photo</ThemedText>
            <TouchableOpacity onPress={showImageOptions} style={styles.photoContainer}>
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.9)', 'rgba(245, 245, 220, 0.7)']}
                style={styles.photoWrapper}
              >
                {profileImage ? (
                  <Image source={{ uri: profileImage }} style={styles.profilePhoto} />
                ) : (
                  <View style={styles.placeholderPhoto}>
                    <Ionicons name="person" size={60} color="#bdc3c7" />
                  </View>
                )}
                <View style={styles.editPhotoOverlay}>
                  <Ionicons name="camera" size={20} color="white" />
                </View>
              </LinearGradient>
            </TouchableOpacity>
            <ThemedText style={styles.photoHint}>
              Tap to change your profile photo
            </ThemedText>
          </View>

          {/* Basic Info Section */}
          <View style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>Basic Information</ThemedText>
            
            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Name</ThemedText>
              <View style={styles.inputContainer}>
                <LinearGradient
                  colors={['rgba(255, 255, 255, 0.9)', 'rgba(245, 245, 220, 0.7)']}
                  style={styles.inputGradient}
                >
                  <TextInput
                    style={styles.textInput}
                    value={name}
                    onChangeText={setName}
                    placeholder="Enter your name"
                    placeholderTextColor="#7f8c8d"
                  />
                </LinearGradient>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Age</ThemedText>
              <View style={styles.inputContainer}>
                <LinearGradient
                  colors={['rgba(255, 255, 255, 0.9)', 'rgba(245, 245, 220, 0.7)']}
                  style={styles.inputGradient}
                >
                  <TextInput
                    style={styles.textInput}
                    value={age}
                    onChangeText={setAge}
                    placeholder="Enter your age"
                    placeholderTextColor="#7f8c8d"
                    keyboardType="numeric"
                  />
                </LinearGradient>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Location</ThemedText>
              <View style={styles.inputContainer}>
                <LinearGradient
                  colors={['rgba(255, 255, 255, 0.9)', 'rgba(245, 245, 220, 0.7)']}
                  style={styles.inputGradient}
                >
                  <TextInput
                    style={styles.textInput}
                    value={location}
                    onChangeText={setLocation}
                    placeholder="Enter your location"
                    placeholderTextColor="#7f8c8d"
                  />
                </LinearGradient>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Bio</ThemedText>
              <View style={styles.inputContainer}>
                <LinearGradient
                  colors={['rgba(255, 255, 255, 0.9)', 'rgba(245, 245, 220, 0.7)']}
                  style={styles.inputGradient}
                >
                  <TextInput
                    style={[styles.textInput, styles.bioInput]}
                    value={bio}
                    onChangeText={setBio}
                    placeholder="Tell others about yourself..."
                    placeholderTextColor="#7f8c8d"
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                  />
                </LinearGradient>
              </View>
            </View>
          </View>

          {/* Photo Options Section */}
          <View style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>Photo Options</ThemedText>
            
            <TouchableOpacity onPress={takePhoto} style={styles.photoOption}>
              <LinearGradient
                colors={['rgba(52, 152, 219, 0.1)', 'rgba(155, 89, 182, 0.05)']}
                style={styles.photoOptionGradient}
              >
                <Ionicons name="camera" size={24} color="#3498db" />
                <View style={styles.photoOptionText}>
                  <ThemedText style={styles.photoOptionTitle}>Take Photo</ThemedText>
                  <ThemedText style={styles.photoOptionSubtitle}>
                    Capture a new photo with your camera
                  </ThemedText>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#7f8c8d" />
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity onPress={pickImage} style={styles.photoOption}>
              <LinearGradient
                colors={['rgba(46, 204, 113, 0.1)', 'rgba(26, 188, 156, 0.05)']}
                style={styles.photoOptionGradient}
              >
                <Ionicons name="images" size={24} color="#27ae60" />
                <View style={styles.photoOptionText}>
                  <ThemedText style={styles.photoOptionTitle}>Choose from Gallery</ThemedText>
                  <ThemedText style={styles.photoOptionSubtitle}>
                    Select a photo from your camera roll
                  </ThemedText>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#7f8c8d" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ThemedView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(240, 248, 255, 0.95)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(52, 73, 94, 0.1)',
  },
  closeButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2c3e50',
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#3498db',
    borderRadius: 8,
  },
  saveText: {
    color: 'white',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  photoSection: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 20,
  },
  photoContainer: {
    marginBottom: 12,
  },
  photoWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 3,
    borderColor: 'rgba(52, 152, 219, 0.3)',
  },
  profilePhoto: {
    width: '100%',
    height: '100%',
  },
  placeholderPhoto: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(236, 240, 241, 0.8)',
  },
  editPhotoOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#3498db',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  photoHint: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  section: {
    marginBottom: 30,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2c3e50',
    marginBottom: 8,
  },
  inputContainer: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  inputGradient: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  textInput: {
    fontSize: 16,
    color: '#2c3e50',
    minHeight: 20,
  },
  bioInput: {
    minHeight: 80,
  },
  photoOption: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  photoOptionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  photoOptionText: {
    flex: 1,
    marginLeft: 16,
  },
  photoOptionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2c3e50',
    marginBottom: 4,
  },
  photoOptionSubtitle: {
    fontSize: 14,
    color: '#7f8c8d',
  },
});

export default EditProfileModal;