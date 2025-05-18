import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { Text, Divider, Card, Chip, ActivityIndicator, FAB } from 'react-native-paper';
import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import Button from '../components/Button';
import Colors from '../constants/colors';
import { getTeams, getPlayers } from '../utils/storage';

const TeamsScreen = ({ navigation }) => {
  const [teams, setTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [playerCounts, setPlayerCounts] = useState({});
  
  // Load teams from storage
  useEffect(() => {
    const loadTeams = async () => {
      try {
        const storedTeams = await getTeams();
        setTeams(storedTeams);
        
        // Load player counts for each team
        const storedPlayers = await getPlayers();
        const counts = {};
        storedPlayers.forEach(player => {
          if (player.teamId) {
            counts[player.teamId] = (counts[player.teamId] || 0) + 1;
          }
        });
        setPlayerCounts(counts);
      } catch (error) {
        console.error('Error loading teams:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTeams();
  }, []);
  
  // Refresh teams when navigating back to this screen
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      try {
        setIsLoading(true);
        const storedTeams = await getTeams();
        setTeams(storedTeams);
        
        // Refresh player counts
        const storedPlayers = await getPlayers();
        const counts = {};
        storedPlayers.forEach(player => {
          if (player.teamId) {
            counts[player.teamId] = (counts[player.teamId] || 0) + 1;
          }
        });
        setPlayerCounts(counts);
      } catch (error) {
        console.error('Error refreshing teams:', error);
      } finally {
        setIsLoading(false);
      }
    });
    
    return unsubscribe;
  }, [navigation]);

  const renderTeamItem = ({ item }) => {
    const playerCount = playerCounts[item.id] || 0;
    const maxPlayers = 16; // Assuming max team size is 16 players
    const fillPercentage = Math.min(playerCount / maxPlayers, 1);
    
    return (
      <Card 
        style={styles.teamCard} 
        onPress={() => navigation.navigate('TeamDetails', { teamId: item.id })}
        elevation={1}
      >
        <View style={styles.teamCardContent}>
          <View style={styles.teamHeader}>
            <View style={styles.teamIconContainer}>
              <FontAwesome5 name="users" size={20} color={Colors.primary} solid />
            </View>
            <View style={styles.teamInfo}>
              <Text style={styles.teamName}>{item.name}</Text>
              <View style={styles.teamMeta}>
                <FontAwesome5 name="trophy" size={12} color={Colors.textLight} solid style={styles.metaIcon} />
                <Text style={styles.metaText}>{item.division} Division</Text>
                <Divider style={styles.metaDivider} />
                <MaterialCommunityIcons name="account-group" size={14} color={Colors.textLight} style={styles.metaIcon} />
                <Text style={styles.metaText}>{playerCount} Players</Text>
              </View>
            </View>
            <Chip 
              style={[styles.categoryChip, { 
                backgroundColor: item.category === 'Men' ? Colors.primary : Colors.secondary 
              }]}
              textStyle={styles.categoryChipText}
              compact
            >
              {item.category}
            </Chip>
          </View>
          
          <View style={styles.progressSection}>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { width: `${fillPercentage * 100}%` }]} />
            </View>
            <View style={styles.progressLabels}>
              <Text style={styles.progressLabel}>Roster Fill</Text>
              <Text style={styles.progressPercentage}>{Math.round(fillPercentage * 100)}%</Text>
            </View>
          </View>
          
          <View style={styles.teamActions}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('PlayerList', { teamId: item.id })}
            >
              <MaterialCommunityIcons name="account-group" size={16} color={Colors.primary} />
              <Text style={styles.actionButtonText}>View Players</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('PlayerRegistration', { teamId: item.id })}
            >
              <Ionicons name="person-add" size={16} color={Colors.primary} />
              <Text style={styles.actionButtonText}>Add Player</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Teams</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading teams...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (teams.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Teams</Text>
        </View>
        <View style={styles.emptyContainer}>
          <FontAwesome5 name="users" size={48} color={Colors.textLight} />
          <Text style={styles.emptyTitle}>No Teams Yet</Text>
          <Text style={styles.emptyText}>
            You haven't registered any teams yet. Create your first team to get started!
          </Text>
          <Button style={styles.emptyButton} mode="contained" onPress={() => navigation.navigate('TeamRegistration')}>
            Register a Team
          </Button>
        </View>
        <FAB style={styles.fab} icon="plus" onPress={() => navigation.navigate('TeamRegistration')} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={Colors.background} barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Teams</Text>
        <Text style={styles.headerCount}>{teams.length} teams</Text>
      </View>
      <FlatList
        data={teams}
        renderItem={renderTeamItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
      />
      <FAB style={styles.fab} icon="plus" onPress={() => navigation.navigate('TeamRegistration')} />
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
  listContent: {
    padding: 16,
    paddingBottom: 80, // Extra padding for FAB
  },
  teamCard: {
    marginBottom: 12,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  teamCardContent: {
    padding: 16,
  },
  teamHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  teamIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  teamInfo: {
    flex: 1,
  },
  teamName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  teamMeta: {
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
  categoryChip: {
    height: 24,
  },
  categoryChipText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  progressSection: {
    marginBottom: 12,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: Colors.progressBackground,
    borderRadius: 3,
    marginBottom: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.progressForeground,
    borderRadius: 3,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabel: {
    fontSize: 12,
    color: Colors.textLight,
  },
  progressPercentage: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  teamActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 12,
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

export default TeamsScreen;
