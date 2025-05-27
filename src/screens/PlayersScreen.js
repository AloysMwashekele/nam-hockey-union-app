import React, { useState, useEffect } from 'react'; // Importing React and necessary hooks
import { StyleSheet, View, FlatList, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native'; // Importing components from React Native
import { Text, Divider, Card, Chip, ActivityIndicator, FAB, Searchbar } from 'react-native-paper'; // Importing UI components from React Native Paper
import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'; // Importing icon libraries

import Button from '../components/Button'; // Importing a custom Button component
import Colors from '../constants/colors'; // Importing color constants
import { getPlayers, getTeams } from '../utils/storage'; // Importing async storage utility functions

const PlayersScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState(''); // State for search input
  const [players, setPlayers] = useState([]); // State to store players list
  const [teams, setTeams] = useState({}); // State to map team IDs to names
  const [isLoading, setIsLoading] = useState(true); // State to manage loading spinner

  // Load players and teams from local storage on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const storedTeams = await getTeams(); // Retrieve teams
        const teamMap = {}; // Temporary object to hold team mappings
        storedTeams.forEach(team => {
          teamMap[team.id] = team.name; // Map team ID to team name
        });
        setTeams(teamMap); // Update state with team mappings

        const storedPlayers = await getPlayers(); // Retrieve players
        const formattedPlayers = storedPlayers.map(player => ({ // Format players for display
          id: player.id,
          name: `${player.firstName} ${player.lastName}`,
          team: teamMap[player.teamId] || 'Unknown Team',
          position: player.position,
          age: calculateAge(player.dateOfBirth),
          teamId: player.teamId
        }));
        setPlayers(formattedPlayers); // Update state with formatted players
      } catch (error) {
        console.error('Error loading players:', error); // Log any error during loading
      } finally {
        setIsLoading(false); // Hide loading spinner
      }
    };

    loadData(); // Call load function
  }, []);

  // Reload players and teams whenever screen is focused
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      try {
        setIsLoading(true); // Show loading spinner

        const storedTeams = await getTeams(); // Refresh teams
        const teamMap = {};
        storedTeams.forEach(team => {
          teamMap[team.id] = team.name; // Map team ID to team name
        });
        setTeams(teamMap);

        const storedPlayers = await getPlayers(); // Refresh players
        const formattedPlayers = storedPlayers.map(player => ({
          id: player.id,
          name: `${player.firstName} ${player.lastName}`,
          team: teamMap[player.teamId] || 'Unknown Team',
          position: player.position,
          age: calculateAge(player.dateOfBirth),
          teamId: player.teamId
        }));
        setPlayers(formattedPlayers);
      } catch (error) {
        console.error('Error refreshing players:', error); // Log errors
      } finally {
        setIsLoading(false); // Hide loading
      }
    });

    return unsubscribe; // Clean up the event listener
  }, [navigation]);

  // Calculate age from date of birth string
  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return 0; // Return 0 if no DOB

    const dob = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--; // Adjust if birthday hasn't occurred yet this year
    }

    return age;
  };

  // Filter players based on search input
  const filteredPlayers = players.filter(player => 
    player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    player.team.toLowerCase().includes(searchQuery.toLowerCase()) ||
    player.position.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Render each player item in the list
  const renderPlayerItem = ({ item }) => {
    const statPercentage = (item.age / 40) * 100; // Sample visual metric based on age

    return (
      <Card 
        style={styles.playerCard} 
        onPress={() => navigation.navigate('PlayerDetails', { playerId: item.id })} // Navigate to player details
        elevation={1}
      >
        <View style={styles.playerCardContent}>
          <View style={styles.playerHeader}>
            <View style={styles.playerIconContainer}>
              <FontAwesome5 name="user" size={20} color={Colors.primary} solid />
            </View>
            <View style={styles.playerInfo}>
              <Text style={styles.playerName}>{item.name}</Text>
              <View style={styles.playerMeta}>
                <FontAwesome5 name="users" size={12} color={Colors.textLight} solid style={styles.metaIcon} />
                <Text style={styles.metaText}>{item.team}</Text>
                <Divider style={styles.metaDivider} />
                <MaterialCommunityIcons name="calendar-account" size={14} color={Colors.textLight} style={styles.metaIcon} />
                <Text style={styles.metaText}>{item.age} years</Text>
              </View>
            </View>
            <Chip 
              style={[styles.positionChip, { backgroundColor: Colors.primary }]}
              textStyle={styles.positionChipText}
              compact
            >
              {item.position}
            </Chip>
          </View>

          <View style={styles.playerActions}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('PlayerDetails', { playerId: item.id })} // View player details
            >
              <Ionicons name="information-circle-outline" size={16} color={Colors.primary} />
              <Text style={styles.actionButtonText}>Details</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('PlayerEdit', { playerId: item.id })} // Edit player info
            >
              <MaterialCommunityIcons name="account-edit" size={16} color={Colors.primary} />
              <Text style={styles.actionButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Card>
    );
  };

  // Show loading spinner while fetching data
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor={Colors.background} barStyle="dark-content" />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Players</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading players...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Main UI when not loading
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={Colors.background} barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Players</Text>
        <Text style={styles.headerCount}>{players.length} players</Text>
      </View>

      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search players..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
          iconColor={Colors.textLight}
          inputStyle={styles.searchInput}
        />
      </View>

      {filteredPlayers.length > 0 ? (
        <FlatList
          data={filteredPlayers}
          keyExtractor={item => item.id}
          renderItem={renderPlayerItem}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <FontAwesome5 name="user-slash" size={48} color={Colors.textLight} />
          <Text style={styles.emptyTitle}>
            {searchQuery ? 'No Matches Found' : 'No Players Yet'}
          </Text>
          <Text style={styles.emptyText}>
            {searchQuery ? 
              `No players match "${searchQuery}". Try a different search.` : 
              "You haven't registered any players yet. Create your first player to get started!"}
          </Text>
          {!searchQuery && (
            <Button
              mode="contained"
              onPress={() => navigation.navigate('PlayerRegistration')} // Navigate to player registration
              style={styles.emptyButton}
            >
              Register a Player
            </Button>
          )}
        </View>
      )}

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('PlayerRegistration')} // Navigate to register new player
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // ... (styles remain unchanged)
});

export default PlayersScreen; // Exporting the component
