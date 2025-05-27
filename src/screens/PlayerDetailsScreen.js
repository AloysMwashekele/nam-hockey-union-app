// Importing necessary modules and components from React and React Native
import React, { useState, useEffect } from 'react'; // React core and hooks
import { StyleSheet, View, Text, ScrollView, Image, ActivityIndicator, Alert } from 'react-native'; // Core React Native components
import { Ionicons } from '@expo/vector-icons'; // Ionicons for UI icons

// Importing custom reusable components and constants
import Card from '../components/Card'; // Custom Card component for layout
import Button from '../components/Button'; // Custom Button component
import Colors from '../constants/colors'; // Centralized color palette
import { getPlayers, getTeams } from '../utils/storage'; // Utility functions for fetching players and teams from storage

// Main functional component for the screen
const PlayerDetailsScreen = ({ route, navigation }) => {
  const { playerId } = route.params; // Extracting playerId from navigation route params
  
  // State variables for holding player data, team name, loading status, and errors
  const [player, setPlayer] = useState(null); // Player data object
  const [teamName, setTeamName] = useState(''); // Team name string
  const [isLoading, setIsLoading] = useState(true); // Loading indicator state
  const [error, setError] = useState(null); // Error message string

  // useEffect hook to fetch player data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true); // Show loading indicator

        const playersData = await getPlayers(); // Get all players from storage
        const foundPlayer = playersData.find(p => p.id === playerId); // Find the player with the matching ID

        if (!foundPlayer) {
          setError('Player not found'); // Set error if player is not found
          return;
        }

        setPlayer(foundPlayer); // Store player in state

        if (foundPlayer.teamId) { // If the player has a teamId
          const teamsData = await getTeams(); // Fetch all teams
          const team = teamsData.find(t => t.id === foundPlayer.teamId); // Find the team by ID
          if (team) {
            setTeamName(team.name); // Set the team name if found
          }
        }

      } catch (error) {
        console.error('Error fetching player details:', error); // Log error to console
        setError('Failed to load player details'); // Set error message in state
      } finally {
        setIsLoading(false); // Hide loading indicator
      }
    };

    fetchData(); // Call fetchData on mount
  }, [playerId]); // Re-run only when playerId changes

  // Utility function to calculate age from date of birth
  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return ''; // Return empty if no DOB

    const birthDate = new Date(dateOfBirth); // Convert DOB to Date object
    const today = new Date(); // Get current date

    let age = today.getFullYear() - birthDate.getFullYear(); // Calculate difference in years
    const monthDiff = today.getMonth() - birthDate.getMonth(); // Calculate difference in months

    // Adjust age if birthday hasn't occurred yet this year
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age; // Return calculated age
  };

  // Show loading spinner while fetching data
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} /> {/* Loading spinner */}
        <Text style={styles.loadingText}>Loading player details...</Text> {/* Loading text */}
      </View>
    );
  }

  // Display error message if error occurred or player not found
  if (error || !player) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={50} color={Colors.error} /> {/* Error icon */}
        <Text style={styles.errorText}>{error || 'Player not found'}</Text> {/* Error message */}
        <Button title="Go Back" onPress={() => navigation.goBack()} /> {/* Back navigation */}
      </View>
    );
  }

  // Main UI content for displaying player details
  return (
    <ScrollView style={styles.screen}> {/* Scrollable screen container */}
      <View style={styles.container}>
        {/* Profile Section */}
        <View style={styles.profileHeader}>
          <View style={styles.profileImageContainer}>
            {player.profileImage ? (
              <Image source={{ uri: player.profileImage }} style={styles.profileImage} /> // Display profile image if available
            ) : (
              <View style={styles.profileImagePlaceholder}> {/* Placeholder image */}
                <Ionicons name="person" size={60} color={Colors.gray} />
              </View>
            )}
          </View>
          <Text style={styles.playerName}>{`${player.firstName} ${player.lastName}`}</Text> {/* Full name */}
          <View style={styles.positionBadge}>
            <Text style={styles.positionText}>{player.position}</Text> {/* Player position */}
          </View>
        </View>

        {/* Personal Info Card */}
        <Card style={styles.infoCard}>
          <Text style={styles.cardTitle}>Personal Information</Text>
          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={20} color={Colors.primary} />
            <Text style={styles.infoText}>Age: {calculateAge(player.dateOfBirth)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={20} color={Colors.primary} />
            <Text style={styles.infoText}>Date of Birth: {new Date(player.dateOfBirth).toLocaleDateString()}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="person-outline" size={20} color={Colors.primary} />
            <Text style={styles.infoText}>Gender: {player.gender}</Text>
          </View>
        </Card>

        {/* Team Info Card */}
        <Card style={styles.infoCard}>
          <Text style={styles.cardTitle}>Team Information</Text>
          <View style={styles.infoRow}>
            <Ionicons name="people-outline" size={20} color={Colors.primary} />
            <Text style={styles.infoText}>Team: {teamName}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="football-outline" size={20} color={Colors.primary} />
            <Text style={styles.infoText}>Position: {player.position}</Text>
          </View>
        </Card>

        {/* Contact Info Card */}
        <Card style={styles.infoCard}>
          <Text style={styles.cardTitle}>Contact Information</Text>
          <View style={styles.infoRow}>
            <Ionicons name="mail-outline" size={20} color={Colors.primary} />
            <Text style={styles.infoText}>{player.email}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="call-outline" size={20} color={Colors.primary} />
            <Text style={styles.infoText}>{player.phone}</Text>
          </View>
        </Card>

        {/* Edit Button */}
        <View style={styles.buttonContainer}>
          <Button
            title="Edit Player"
            onPress={() => {}} // TODO: Add navigation to edit screen
            style={styles.button}
          />
        </View>
      </View>
    </ScrollView>
  );
};

// Stylesheet for the screen
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background, // Use background color from constants
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: Colors.secondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    marginVertical: 20,
    fontSize: 16,
    color: Colors.error,
    textAlign: 'center',
  },
  container: {
    padding: 16, // Padding for content
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  profileImageContainer: {
    marginBottom: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60, // Circular image
  },
  profileImagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.gray,
  },
  playerName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.secondary,
    marginBottom: 8,
  },
  positionBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  positionText: {
    color: Colors.background,
    fontSize: 14,
    fontWeight: 'bold',
  },
  infoCard: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.secondary,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 16,
    color: Colors.secondary,
    marginLeft: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  statItem: {
    alignItems: 'center',
    width: '30%',
    marginBottom: 16,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.secondary,
    marginTop: 4,
  },
  bio: {
    fontSize: 16,
    color: Colors.secondary,
    lineHeight: 24,
  },
  buttonContainer: {
    marginTop: 8,
  },
  button: {
    marginBottom: 12,
  },
});

// Exporting the component as default
export default PlayerDetailsScreen;
