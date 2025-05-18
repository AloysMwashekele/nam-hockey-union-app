import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { Text, Divider, Card, Chip, ActivityIndicator, FAB, Searchbar } from 'react-native-paper';
import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import Button from '../components/Button';
import Colors from '../constants/colors';
import { getPlayers, getTeams } from '../utils/storage';

const PlayersScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  
  // Load players and teams from storage
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load teams first to get team names
        const storedTeams = await getTeams();
        const teamMap = {};
        storedTeams.forEach(team => {
          teamMap[team.id] = team.name;
        });
        setTeams(teamMap);
        
        // Load players
        const storedPlayers = await getPlayers();
        // Format player data
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
        console.error('Error loading players:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  // Refresh data when navigating back to this screen
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      try {
        setIsLoading(true);
        
        // Refresh teams
        const storedTeams = await getTeams();
        const teamMap = {};
        storedTeams.forEach(team => {
          teamMap[team.id] = team.name;
        });
        setTeams(teamMap);
        
        // Refresh players
        const storedPlayers = await getPlayers();
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
        console.error('Error refreshing players:', error);
      } finally {
        setIsLoading(false);
      }
    });
    
    return unsubscribe;
  }, [navigation]);
  
  // Helper function to calculate age from date of birth
  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return 0;
    
    const dob = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    
    return age;
  };

  const filteredPlayers = players.filter(player => 
    player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    player.team.toLowerCase().includes(searchQuery.toLowerCase()) ||
    player.position.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderPlayerItem = ({ item }) => {
    // Calculate a stat percentage for the circular indicator (just for visual purposes)
    const statPercentage = (item.age / 40) * 100; // Using age as a sample metric
    
    return (
      <Card 
        style={styles.playerCard} 
        onPress={() => navigation.navigate('PlayerDetails', { playerId: item.id })}
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
              style={[styles.positionChip, { 
                backgroundColor: Colors.primary
              }]}
              textStyle={styles.positionChipText}
              compact
            >
              {item.position}
            </Chip>
          </View>
          
          <View style={styles.playerActions}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('PlayerDetails', { playerId: item.id })}
            >
              <Ionicons name="information-circle-outline" size={16} color={Colors.primary} />
              <Text style={styles.actionButtonText}>Details</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('PlayerEdit', { playerId: item.id })}
            >
              <MaterialCommunityIcons name="account-edit" size={16} color={Colors.primary} />
              <Text style={styles.actionButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Card>
    );
  };

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
              onPress={() => navigation.navigate('PlayerRegistration')}
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
        onPress={() => navigation.navigate('PlayerRegistration')}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.background,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
  },
  headerCount: {
    fontSize: 14,
    color: Colors.textLight,
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 12,
    marginTop: 8,
  },
  searchBar: {
    elevation: 1,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    height: 40,
  },
  searchInput: {
    fontSize: 14,
    color: Colors.text,
  },
  listContent: {
    padding: 16,
    paddingBottom: 80, // Extra padding for FAB
  },
  playerCard: {
    marginBottom: 12,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  playerCardContent: {
    padding: 16,
  },
  playerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  playerIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  playerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaIcon: {
    marginRight: 4,
  },
  metaText: {
    fontSize: 12,
    color: Colors.textLight,
    marginRight: 8,
  },
  metaDivider: {
    width: 1,
    height: 12,
    backgroundColor: Colors.divider,
    marginHorizontal: 8,
  },
  positionChip: {
    height: 24,
  },
  positionChipText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  playerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 12,
    marginTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  actionButtonText: {
    fontSize: 14,
    color: Colors.primary,
    marginLeft: 6,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    color: Colors.textLight,
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: 16,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textLight,
    marginVertical: 8,
    textAlign: 'center',
    maxWidth: 280,
  },
  emptyButton: {
    marginTop: 16,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.primary,
  },
  divider: {
    backgroundColor: Colors.divider,
    height: 1,
    marginVertical: 4,
  },
});

export default PlayersScreen;
