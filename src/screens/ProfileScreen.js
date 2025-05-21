import React, { useState, useContext } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Text, Card, Avatar, Divider, IconButton } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import Button from '../components/Button';
import Colors from '../constants/colors';
import { AuthContext } from '../context/AuthContext';

// ProfileScreen: displays current user details and provides account actions
const ProfileScreen = ({ navigation }) => {
  // Access logged-in user info and logout function
  const { user, signOut } = useContext(AuthContext);
  // Loading state indicates when logout is in progress
  const [isLoading, setIsLoading] = useState(false);

  // Handler for logout button press
  const handleLogout = async () => {
    try {
      setIsLoading(true);                   // Show loading indicator on logout
      await signOut();                      // Invoke context signOut to clear session
      // AuthContext will redirect to login screen automatically
    } catch (error) {
      console.error('Error logging out:', error);  // Debug any logout errors
      alert('Failed to logout. Please try again.');
    } finally {
      setIsLoading(false);                  // Hide loading indicator
    }
  };

  // Provide fallback values if user data is not available
  const userData = user || {
    username: 'Guest User',                // Default display name
    email: 'guest@example.com',            // Placeholder email
    phone: 'Not available',                // Placeholder phone
    team: 'Not assigned',                  // Placeholder team
    position: 'Not assigned',              // Placeholder position
    memberSince: new Date().getFullYear().toString(), // Current year
    profileImage: null,                    // No image by default
  };

  // Reusable component to render an icon with label and value
  const InfoItem = ({ icon, label, value }) => (
    <View style={styles.infoItem}>
      <MaterialCommunityIcons
        name={icon}
        size={20}
        color={Colors.primary}
        style={styles.infoIcon}
      />
      <View>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* HEADER: title and settings button */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <IconButton 
          icon="cog-outline" 
          size={24} 
          onPress={() => { /* TODO: navigate to SettingsScreen */ }} 
          color={Colors.text}
        />
      </View>
      {/* MAIN CONTENT: scrollable profile sections */}
      <ScrollView style={styles.content}>
        {/* PROFILE SECTION: avatar and basic info */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            {userData.profileImage ? (
              // If user uploaded an image, display it
              <Avatar.Image size={80} source={{ uri: userData.profileImage }} />
            ) : (
              // Otherwise show default avatar icon
              <Avatar.Icon size={80} icon="account" color={Colors.background} style={styles.avatar} />
            )}
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>{userData.username || userData.name || 'User'}</Text>
            <Text style={styles.userRole}>{userData.position} • {userData.team}</Text>
            <Text style={styles.memberSince}>Member since {userData.memberSince}</Text>
          </View>
        </View>

        {/* CONTACT INFO CARD */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Contact Information</Text>
            <Divider style={styles.divider} />
            <InfoItem icon="email-outline" label="Email" value={userData.email} />
           
          </Card.Content>
        </Card>

        {/* HOCKEY INFO CARD */}
       

        {/* ACTION BUTTONS: edit, change password, logout */}
        <View style={styles.actionsContainer}>
          <Button
            title="Edit Profile"
            onPress={() => { /* TODO: navigate to EditProfileScreen */ }}
            mode="contained"
            style={styles.actionButton}
          />
         
          <Button
            title="Logout"
            onPress={handleLogout}
            mode="contained"
            style={[styles.actionButton, styles.logoutButton]}
            loading={isLoading}                 // Show spinner while logging out
          />
        </View>
      </ScrollView>
    </View>
  );
};

// Styles for layout and visual consistency
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,    // Screen background color
  },
  header: {
    flexDirection: 'row',                  // Horizontal layout
    justifyContent: 'space-between',       // Title left, button right
    alignItems: 'center',                  // Vertically center elements
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,      // Subtle bottom border
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
  },
  content: {
    flex: 1,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.surface,       // Card-like background
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  avatarContainer: {
    marginRight: 16,                       // Space between avatar and info
  },
  avatar: {
    backgroundColor: Colors.primary,      // Default avatar background color
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  userRole: {
    fontSize: 14,
    color: Colors.textLight,
    marginBottom: 2,
  },
  memberSince: {
    fontSize: 12,
    color: Colors.textLight,
  },
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoIcon: {
    marginRight: 16,                       // Space between icon and text
  },
  infoLabel: {
    fontSize: 12,
    color: Colors.textLight,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: Colors.text,
  },
  actionsContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  actionButton: {
    marginBottom: 12,                     // Space between buttons
  },
  logoutButton: {
    backgroundColor: Colors.error,        // Highlight logout in red
  },
});

export default ProfileScreen;
