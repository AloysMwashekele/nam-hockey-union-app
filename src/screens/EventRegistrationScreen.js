import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Alert, KeyboardAvoidingView, Platform, ScrollView, FlatList } from 'react-native';
import { Text, Surface, Divider, Checkbox, Card, Title, Paragraph, ActivityIndicator, List, Button as PaperButton, Menu, Chip, Banner } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import Button from '../components/Button';
import Colors from '../constants/colors';
import { getTeams, getPlayers, getEvents, saveEventRegistration } from '../utils/storage';

const EventRegistrationScreen = ({ route, navigation }) => {
  const { eventId } = route.params || {};
  const [selectedTeam, setSelectedTeam] = useState('');
  const [selectedTeamName, setSelectedTeamName] = useState('Select a team');
  const [showTeamMenu, setShowTeamMenu] = useState(false);
  const [teamOptions, setTeamOptions] = useState([]);
  const [minimumPlayers, setMinimumPlayers] = useState(2); // Minimum players required for an event
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // State for event, teams, and players data
  const [event, setEvent] = useState(null);
  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);
  
  // Load data from storage
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load event data
        const events = await getEvents();
        const foundEvent = events.find(e => e.id === eventId);
        if (foundEvent) {
          setEvent(foundEvent);
        } else {
          // Handle case when event is not found
          console.error('Event not found with ID:', eventId);
          Alert.alert(
            'Error',
            'Event not found. Please try again or contact support.',
            [{ text: 'OK', onPress: () => navigation.goBack() }]
          );
          return;
        }
        
        // Load teams
        const storedTeams = await getTeams();
        setTeams(storedTeams);
        
        // Format teams for dropdown
        const formattedTeams = storedTeams.map(team => ({
          name: team.name,
          id: team.id
        }));
        setTeamOptions(formattedTeams);
        
        // Load players
        const storedPlayers = await getPlayers();
        // Format player names for display
        const formattedPlayers = storedPlayers.map(player => ({
          id: player.id,
          name: `${player.firstName} ${player.lastName}`,
          teamId: player.teamId
        }));
        setPlayers(formattedPlayers);
      } catch (error) {
        console.error('Error loading data:', error);
        Alert.alert('Error', 'Failed to load data. Please try again.');
      }
    };
    
    loadData();
  }, [eventId]);
  
  // Update team name when team id changes
  useEffect(() => {
    if (selectedTeam) {
      const team = teamOptions.find(t => t.id === selectedTeam);
      if (team) {
        setSelectedTeamName(team.name);
      }
    }
  }, [selectedTeam, teamOptions]);
  
  // Filter players based on selected team
  const teamPlayers = players.filter(player => player.teamId === selectedTeam);
  
  // Get the number of players in the team
  const playerCount = teamPlayers.length;
  

  
  const handleSubmit = async () => {
    if (!selectedTeam) {
      Alert.alert('Validation Error', 'Please select a team');
      return;
    }
    
    if (playerCount < minimumPlayers) {
      Alert.alert('Validation Error', `Your team needs at least ${minimumPlayers} players to register (currently has ${playerCount})`);
      return;
    }
    
    if (!acceptedTerms) {
      Alert.alert('Validation Error', 'Please accept the terms and conditions');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Get all player IDs from the team (up to the first minimumPlayers)
      const playerIds = teamPlayers.slice(0, minimumPlayers).map(player => player.id);
      
      const registrationData = {
        eventId,
        teamId: selectedTeam,
        playerIds: playerIds,
        acceptedTerms,
      };
      
      await saveEventRegistration(registrationData);
      
      setIsLoading(false);
      Alert.alert(
        'Success',
        'Event registration submitted successfully!',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Error', 'Failed to save registration. Please try again.');
      console.error('Error saving registration:', error);
    }
  };
  
  // Show loading or error state if event is not loaded yet
  if (!event) {
    return (
      <View style={[styles.screen, styles.centerContent]}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading event details...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Surface style={styles.headerSection} elevation={1}>
          <Text variant="headlineSmall" style={styles.title}>Event Registration</Text>
          <Text variant="bodyMedium" style={styles.subtitle}>Register for {event.title}</Text>
        </Surface>
        
        <View style={styles.container}>
          <Card style={styles.eventInfoCard} mode="outlined">
            <Card.Content>
              <Title style={styles.eventInfoTitle}>Event Details</Title>
              <Divider style={styles.divider} />
              
              <List.Item
                title="Date"
                description={new Date(event.date).toLocaleDateString()}
                left={props => <List.Icon {...props} icon="calendar" color={Colors.primary} />}
                titleStyle={styles.listItemTitle}
                descriptionStyle={styles.listItemDescription}
              />
              
              <List.Item
                title="Location"
                description={event.location}
                left={props => <List.Icon {...props} icon="map-marker" color={Colors.primary} />}
                titleStyle={styles.listItemTitle}
                descriptionStyle={styles.listItemDescription}
              />
              
              <List.Item
                title="Registration Fee"
                description={event.registrationFee}
                left={props => <List.Icon {...props} icon="cash" color={Colors.primary} />}
                titleStyle={styles.listItemTitle}
                descriptionStyle={styles.listItemDescription}
              />
              
              <Divider style={styles.divider} />
              <Paragraph style={styles.eventDescription}>{event.description}</Paragraph>
            </Card.Content>
          </Card>
          
          <Text variant="titleMedium" style={styles.formSectionTitle}>Team Selection</Text>
          <Divider style={styles.divider} />
          
          <View style={styles.formGroup}>
            <Text variant="bodyMedium" style={styles.label}>Select Team *</Text>
            <Menu
              visible={showTeamMenu}
              onDismiss={() => setShowTeamMenu(false)}
              anchor={
                <PaperButton 
                  mode="outlined" 
                  onPress={() => setShowTeamMenu(true)}
                  icon="chevron-down"
                  contentStyle={styles.dropdownButton}
                  style={styles.menuButton}
                >
                  {selectedTeamName}
                </PaperButton>
              }
            >
              {teamOptions.length > 0 ? (
                teamOptions.map((option) => (
                  <Menu.Item
                    key={option.id}
                    onPress={() => {
                      setSelectedTeam(option.id);
                      setSelectedTeamName(option.name);
                      setShowTeamMenu(false);
                    }}
                    title={option.name}
                    leadingIcon={selectedTeam === option.id ? "check" : undefined}
                  />
                ))
              ) : (
                <Menu.Item title="No teams available" disabled />
              )}
            </Menu>
          </View>
          
          {selectedTeam && (
            <Card style={styles.playersCard} mode="outlined">
              <Card.Content>
                <View style={styles.playerHeaderRow}>
                  <Title style={styles.playersSectionTitle}>Team Players</Title>
                  <Chip mode="flat" style={styles.playerCountChip}>
                    {playerCount} players
                  </Chip>
                </View>
                
                {playerCount < minimumPlayers ? (
                  <Banner
                    visible={true}
                    icon="alert"
                    style={styles.warningBanner}
                  >
                    Your team needs at least {minimumPlayers} players to register for this event.
                  </Banner>
                ) : (
                  <Banner
                    visible={true}
                    icon="check-circle"
                    style={styles.successBanner}
                  >
                    Your team meets the minimum requirement of {minimumPlayers} players.
                  </Banner>
                )}
                
                {teamPlayers.length > 0 ? (
                  <View style={styles.playersList}>
                    {teamPlayers.slice(0, 5).map((player, index) => (
                      <List.Item
                        key={player.id}
                        title={player.name}
                        left={props => <List.Icon {...props} icon="account" />}
                        titleStyle={styles.playerName}
                      />
                    ))}
                    {teamPlayers.length > 5 && (
                      <Text style={styles.morePlayersText}>+{teamPlayers.length - 5} more players</Text>
                    )}
                  </View>
                ) : (
                  <Text style={styles.noPlayersText}>No players found for this team</Text>
                )}
              </Card.Content>
            </Card>
          )}
          
          <View style={styles.termsContainer}>
            <Checkbox
              status={acceptedTerms ? 'checked' : 'unchecked'}
              onPress={() => setAcceptedTerms(!acceptedTerms)}
              color={Colors.primary}
            />
            <Text variant="bodyMedium" style={styles.termsText}>
              I accept the terms and conditions for this event and confirm that all registered players are eligible to participate.
            </Text>
          </View>
          
          <Button
            title="Submit Registration"
            onPress={handleSubmit}
            loading={isLoading}
            disabled={isLoading || !selectedTeam || playerCount < minimumPlayers}
            icon="check-circle"
            style={styles.submitButton}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  screen: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  headerSection: {
    padding: 24,
    backgroundColor: Colors.primary,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    marginBottom: 16,
  },
  container: {
    padding: 16,
  },
  title: {
    fontWeight: 'bold',
    color: Colors.background,
    marginBottom: 8,
  },
  subtitle: {
    color: Colors.background + 'CC', // Adding transparency
  },
  loadingText: {
    marginTop: 16,
    color: Colors.primary,
    fontSize: 16,
  },
  formSectionTitle: {
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
    marginTop: 16,
  },
  divider: {
    marginVertical: 12,
  },
  eventInfoCard: {
    marginBottom: 24,
    backgroundColor: Colors.background,
    borderColor: Colors.border,
  },
  eventInfoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  listItemTitle: {
    fontSize: 14,
    color: Colors.textLight,
  },
  listItemDescription: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: '500',
  },
  eventDescription: {
    color: Colors.text,
    fontSize: 14,
    marginTop: 8,
    fontStyle: 'italic',
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    color: Colors.text,
  },
  menuButton: {
    width: '100%',
    borderColor: Colors.border,
    borderRadius: 8,
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
  },
  playersCard: {
    marginBottom: 24,
    backgroundColor: Colors.background,
    borderColor: Colors.border,
  },
  playerHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  playersSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
  },
  playerCountChip: {
    backgroundColor: Colors.primary + '20',
  },
  warningBanner: {
    backgroundColor: Colors.error + '15',
    marginBottom: 12,
  },
  successBanner: {
    backgroundColor: Colors.success + '15',
    marginBottom: 12,
  },
  playersList: {
    marginTop: 8,
  },
  playerName: {
    fontSize: 14,
    color: Colors.text,
  },
  morePlayersText: {
    fontSize: 14,
    color: Colors.textLight,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 8,
  },
  noPlayersText: {
    fontSize: 14,
    color: Colors.textLight,
    fontStyle: 'italic',
    padding: 8,
    textAlign: 'center',
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: Colors.surface,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  termsText: {
    color: Colors.text,
    flex: 1,
    marginLeft: 8,
  },
  submitButton: {
    marginTop: 8,
  },
});

export default EventRegistrationScreen;
