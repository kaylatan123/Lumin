import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, Modal, ScrollView, View, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AuraBackground from '@/components/AuraBackground';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import PremiumScreen from '@/components/PremiumScreen';
import EditProfileModal from '@/components/EditProfileModal';
import { useRevenueCat } from '@/components/RevenueCatProvider';

export default function ProfileScreen() {
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const { isPremium } = useRevenueCat();

  return (
    <AuraBackground>
      <ThemedView style={styles.container}>
        {/* Settings Gear Icon */}
        <TouchableOpacity 
          style={styles.settingsGear}
          onPress={() => setShowSettingsModal(true)}
        >
          <LinearGradient
            colors={['rgba(52, 152, 219, 0.2)', 'rgba(155, 89, 182, 0.1)']}
            style={styles.gearBackground}
          >
            <Ionicons name="settings" size={24} color="#2c3e50" />
          </LinearGradient>
        </TouchableOpacity>

        <ScrollView style={styles.scrollContent}>
          {/* Profile Photo Section */}
          <View style={styles.profilePhotoSection}>
            <View style={styles.profilePhotoContainer}>
              <LinearGradient
                colors={['rgba(52, 152, 219, 0.8)', 'rgba(155, 89, 182, 0.6)']}
                style={styles.profilePhotoGradient}
              >
                <TouchableOpacity 
                  style={styles.profilePhotoButton}
                  onPress={() => setShowEditProfileModal(true)}
                >
                  {profileImage ? (
                    <Image source={{ uri: profileImage }} style={styles.profilePhoto} />
                  ) : (
                    <View style={styles.defaultPhotoContainer}>
                      <Ionicons name="person" size={60} color="rgba(255, 255, 255, 0.8)" />
                    </View>
                  )}
                  <View style={styles.editIconContainer}>
                    <Ionicons name="camera" size={20} color="#fff" />
                  </View>
                </TouchableOpacity>
              </LinearGradient>
            </View>
            
            <ThemedText type="title" style={styles.nameText}>Sarah Johnson</ThemedText>
            <ThemedText type="subtitle" style={styles.bioText}>
              Mathematics & Physics Tutor | Stanford Graduate
            </ThemedText>
            <ThemedText style={styles.locationText}>📍 San Francisco, CA</ThemedText>
          </View>

          {/* TikTok-style Preview Section */}
          <View style={styles.previewSection}>
            <ThemedText type="subtitle" style={styles.previewTitle}>Your Posts</ThemedText>
            <View style={styles.previewGrid}>
              <TouchableOpacity style={styles.previewItem}>
                <View style={styles.previewThumbnail}>
                  <Ionicons name="play" size={24} color="#fff" />
                </View>
                <ThemedText style={styles.previewText}>Math Tutorial</ThemedText>
                <ThemedText style={styles.previewViews}>1.2k views</ThemedText>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.previewItem}>
                <View style={styles.previewThumbnail}>
                  <Ionicons name="play" size={24} color="#fff" />
                </View>
                <ThemedText style={styles.previewText}>Chemistry Help</ThemedText>
                <ThemedText style={styles.previewViews}>854 views</ThemedText>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.previewItem}>
                <View style={styles.previewThumbnail}>
                  <Ionicons name="play" size={24} color="#fff" />
                </View>
                <ThemedText style={styles.previewText}>Study Tips</ThemedText>
                <ThemedText style={styles.previewViews}>2.1k views</ThemedText>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.previewItem}>
                <View style={styles.previewThumbnail}>
                  <Ionicons name="play" size={24} color="#fff" />
                </View>
                <ThemedText style={styles.previewText}>Physics Demo</ThemedText>
                <ThemedText style={styles.previewViews}>673 views</ThemedText>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.previewItem}>
                <View style={styles.previewThumbnail}>
                  <Ionicons name="play" size={24} color="#fff" />
                </View>
                <ThemedText style={styles.previewText}>English Grammar</ThemedText>
                <ThemedText style={styles.previewViews}>1.5k views</ThemedText>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.previewItem}>
                <View style={styles.previewThumbnail}>
                  <Ionicons name="play" size={24} color="#fff" />
                </View>
                <ThemedText style={styles.previewText}>History Lesson</ThemedText>
                <ThemedText style={styles.previewViews}>920 views</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {/* Premium Modal */}
        <Modal
          visible={showPremiumModal}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <PremiumScreen onClose={() => setShowPremiumModal(false)} />
        </Modal>

        {/* Edit Profile Modal */}
        <EditProfileModal
          visible={showEditProfileModal}
          onClose={() => setShowEditProfileModal(false)}
          onProfileImageChange={(imageUri) => setProfileImage(imageUri)}
          initialProfileImage={profileImage}
        />

        {/* Settings Modal */}
        <Modal
          visible={showSettingsModal}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <ThemedView style={styles.settingsModal}>
            <View style={styles.settingsHeader}>
              <TouchableOpacity onPress={() => setShowSettingsModal(false)} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#2c3e50" />
              </TouchableOpacity>
              <ThemedText type="title" style={styles.settingsTitle}>Settings</ThemedText>
              <View style={styles.spacer} />
            </View>
            
            <ScrollView style={styles.settingsContent}>
              <ProfileSection 
                title="Account Settings" 
                items={['Edit Profile', 'Privacy Settings', 'Notification Preferences']}
                onItemPress={(item) => {
                  if (item === 'Edit Profile') {
                    setShowSettingsModal(false);
                    setShowEditProfileModal(true);
                  }
                }}
              />
              
              <ProfileSection 
                title="App Features" 
                items={
                  isPremium 
                    ? ['Advanced Matching', 'Priority Support', 'Exclusive Themes']
                    : ['Basic Features', 'Standard Support']
                }
              />
              
              <ProfileSection 
                title="Support" 
                items={[
                  'Help Center',
                  'Contact Support',
                  'Terms of Service',
                  'Privacy Policy',
                ]}
              />
            </ScrollView>
          </ThemedView>
        </Modal>
      </ThemedView>
    </AuraBackground>
  );
}

interface ProfileSectionProps {
  title: string;
  items: string[];
  onItemPress?: (item: string) => void;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ title, items, onItemPress }) => {
  return (
    <View style={styles.profileSection}>
      <ThemedText type="subtitle" style={styles.sectionTitle}>{title}</ThemedText>
      <View style={styles.sectionItems}>
        {items.map((item, index) => (
          <TouchableOpacity 
            key={index}
            style={styles.sectionItem}
            onPress={() => onItemPress?.(item)}
          >
            <ThemedText style={styles.itemText}>{item}</ThemedText>
            <ThemedText style={styles.itemArrow}>›</ThemedText>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  settingsGear: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 1000,
  },
  gearBackground: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  profilePhotoSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  profilePhotoContainer: {
    marginBottom: 16,
  },
  profilePhotoGradient: {
    width: 160,
    height: 160,
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  profilePhotoButton: {
    width: 152,
    height: 152,
    borderRadius: 76,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  profilePhoto: {
    width: 152,
    height: 152,
    borderRadius: 76,
  },
  defaultPhotoContainer: {
    width: 152,
    height: 152,
    borderRadius: 76,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 16,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 8,
  },
  bioText: {
    fontSize: 16,
    color: '#34495e',
    textAlign: 'center',
    marginBottom: 4,
    lineHeight: 22,
  },
  locationText: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  previewSection: {
    marginTop: 40,
    paddingHorizontal: 4,
  },
  previewTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 20,
    textAlign: 'center',
  },
  previewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  previewItem: {
    width: '32%',
    aspectRatio: 9/16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f8f9fa',
    marginBottom: 8,
  },
  previewThumbnail: {
    flex: 1,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  previewText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#2c3e50',
    paddingHorizontal: 6,
    paddingVertical: 4,
    textAlign: 'center',
  },
  previewViews: {
    fontSize: 9,
    color: '#7f8c8d',
    paddingHorizontal: 6,
    paddingBottom: 4,
    textAlign: 'center',
  },
  settingsModal: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  settingsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(52, 73, 94, 0.1)',
  },
  closeButton: {
    padding: 8,
  },
  settingsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2c3e50',
  },
  spacer: {
    width: 40,
  },
  settingsContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  profileSections: {
    gap: 24,
  },
  profileSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 16,
  },
  sectionItems: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(52, 73, 94, 0.05)',
  },
  itemText: {
    fontSize: 16,
    color: '#34495e',
  },
  itemArrow: {
    fontSize: 20,
    color: '#7f8c8d',
  },
});