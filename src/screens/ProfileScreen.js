import React, { useState, useContext } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Text, Card, Avatar, Divider, IconButton } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import Button from '../components/Button';
import Colors from '../constants/colors';
import { AuthContext } from '../context/AuthContext';

const ProfileScreen = ({ navigation }) => {
  const { user, signOut } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await signOut();
      // No need to navigate - the AuthContext will handle updating the auth state
      // which will cause the app to show the login screen
    } catch (error) {
      console.error('Error logging out:', error);
      alert('Failed to logout. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Use the user data from context or fallback to default values
  const userData = user || {
    username: 'Guest User',
    email: 'guest@example.com',
    phone: 'Not available',
    team: 'Not assigned',
    position: 'Not assigned',
    memberSince: new Date().getFullYear().toString(),
    profileImage: null, // We'll use a placeholder
  };

  const InfoItem = ({ icon, label, value }) => (
    <View style={styles.infoItem}>
      <MaterialCommunityIcons name={icon} size={20} color={Colors.primary} style={styles.infoIcon} />
      <View>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <IconButton 
          icon="cog-outline" 
          size={24} 
          onPress={() => {}} 
          color={Colors.text}
        />
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            {userData.profileImage ? (
              <Avatar.Image size={80} source={{ uri: userData.profileImage }} />
            ) : (
              <Avatar.Icon size={80} icon="account" color={Colors.background} style={styles.avatar} />
            )}
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>{userData.username || userData.name || 'User'}</Text>
            <Text style={styles.userRole}>{userData.position} • {userData.team}</Text>
            <Text style={styles.memberSince}>Member since {userData.memberSince}</Text>
          </View>
        </View>

        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Contact Information</Text>
            <Divider style={styles.divider} />
            <InfoItem icon="email-outline" label="Email" value={userData.email} />
            <InfoItem icon="phone-outline" label="Phone" value={userData.phone} />
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Hockey Information</Text>
            <Divider style={styles.divider} />
            <InfoItem icon="account-group-outline" label="Team" value={userData.team} />
            <InfoItem icon="run-fast" label="Position" value={userData.position} />
          </Card.Content>
        </Card>

        <View style={styles.actionsContainer}>
          <Button
            title="Edit Profile"
            onPress={() => {}}
            mode="contained"
            style={styles.actionButton}
          />
          <Button
            title="Change Password"
            onPress={() => {}}
            mode="outlined"
            style={styles.actionButton}
          />
          <Button
            title="Logout"
            onPress={handleLogout}
            mode="contained"
            style={[styles.actionButton, styles.logoutButton]}
            loading={isLoading}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
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
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    backgroundColor: Colors.primary,
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
    margin: 16,
    marginTop: 8,
    marginBottom: 8,
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
    marginRight: 16,
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
    marginBottom: 12,
  },
  logoutButton: {
    backgroundColor: Colors.error,
  },
});

export default ProfileScreen;
