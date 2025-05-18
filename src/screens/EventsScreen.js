import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, Alert, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { Text, Divider, Card, Chip, ActivityIndicator, FAB, IconButton } from 'react-native-paper';
import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import Button from '../components/Button';
import Colors from '../constants/colors';
import { getEvents, deleteEvent, initializeStorage } from '../utils/storage';

const EventsScreen = ({ navigation }) => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load events from storage
  useEffect(() => {
    const loadEvents = async () => {
      try {
        // Initialize storage with sample data if empty
        await initializeStorage();
        
        // Load events
        const storedEvents = await getEvents();
        setEvents(storedEvents);
      } catch (error) {
        console.error('Error loading events:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadEvents();
  }, []);
  
  // Refresh events when navigating back to this screen
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      try {
        setIsLoading(true);
        const storedEvents = await getEvents();
        setEvents(storedEvents);
      } catch (error) {
        console.error('Error refreshing events:', error);
      } finally {
        setIsLoading(false);
      }
    });
    
    return unsubscribe;
  }, [navigation]);
  
  const handleDeleteEvent = async (eventId) => {
    try {
      await deleteEvent(eventId);
      setEvents(events.filter(event => event.id !== eventId));
      Alert.alert('Success', 'Event deleted successfully!');
    } catch (error) {
      console.error('Error deleting event:', error);
      Alert.alert('Error', 'Failed to delete event. Please try again.');
    }
  };

  const renderEventItem = ({ item }) => {
    const eventDate = new Date(item.date);
    const deadlineDate = new Date(item.registrationDeadline);
    const currentDate = new Date();
    
    const isRegistrationOpen = currentDate <= deadlineDate;
    
    // Calculate days remaining for registration
    const daysRemaining = isRegistrationOpen ? 
      Math.ceil((deadlineDate - currentDate) / (1000 * 60 * 60 * 24)) : 0;
    
    // Determine the category color
    let categoryColor;
    if (item.category === 'Tournament') {
      categoryColor = Colors.primary;
    } else if (item.category === 'Training') {
      categoryColor = Colors.secondary;
    } else {
      categoryColor = Colors.warning;
    }
    
    return (
      <Card 
        style={styles.eventCard} 
        onPress={() => navigation.navigate('EventDetails', { eventId: item.id })}
        elevation={1}
      >
        <View style={styles.eventCardContent}>
          <View style={styles.eventHeader}>
            <View style={styles.eventIconContainer}>
              <FontAwesome5 
                name={item.category === 'Tournament' ? 'trophy' : 'hockey-puck'} 
                size={20} 
                color={categoryColor} 
                solid 
              />
            </View>
            <View style={styles.eventInfo}>
              <Text style={styles.eventTitle}>{item.title}</Text>
              <View style={styles.eventMeta}>
                <FontAwesome5 name="calendar-alt" size={12} color={Colors.textLight} solid style={styles.metaIcon} />
                <Text style={styles.metaText}>{eventDate.toLocaleDateString()}</Text>
                <Divider style={styles.metaDivider} />
                <FontAwesome5 name="map-marker-alt" size={12} color={Colors.textLight} solid style={styles.metaIcon} />
                <Text style={styles.metaText}>{item.location}</Text>
              </View>
            </View>
            <Chip 
              style={[styles.categoryChip, { backgroundColor: categoryColor }]}
              textStyle={styles.categoryChipText}
              compact
            >
              {item.category}
            </Chip>
          </View>
          
          <View style={styles.registrationSection}>
            <View style={styles.registrationStatus}>
              <Text style={styles.registrationLabel}>
                {isRegistrationOpen ? 'Registration Open' : 'Registration Closed'}
              </Text>
              {isRegistrationOpen && (
                <Text style={styles.daysRemaining}>{daysRemaining} days left</Text>
              )}
            </View>
            {isRegistrationOpen && (
              <Button
                mode="contained"
                onPress={() => navigation.navigate('EventRegistration', { eventId: item.id })}
                style={styles.registerButton}
                labelStyle={styles.registerButtonText}
              >
                Register
              </Button>
            )}
          </View>
          
          <View style={styles.eventActions}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('EventDetails', { eventId: item.id })}
            >
              <Ionicons name="information-circle-outline" size={16} color={Colors.primary} />
              <Text style={styles.actionButtonText}>Details</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => {
                Alert.alert(
                  'Delete Event',
                  'Are you sure you want to delete this event?',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Delete', onPress: () => handleDeleteEvent(item.id), style: 'destructive' }
                  ]
                );
              }}
            >
              <MaterialCommunityIcons name="delete-outline" size={16} color={Colors.error} />
              <Text style={[styles.actionButtonText, { color: Colors.error }]}>Delete</Text>
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
          <Text style={styles.headerTitle}>Events</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading events...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={Colors.background} barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Events</Text>
        <Text style={styles.headerCount}>{events.length} events</Text>
      </View>
      
      {events.length > 0 ? (
        <FlatList
          data={events}
          keyExtractor={item => item.id}
          renderItem={renderEventItem}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <FontAwesome5 name="calendar-times" size={48} color={Colors.textLight} />
          <Text style={styles.emptyTitle}>No Events Yet</Text>
          <Text style={styles.emptyText}>
            You haven't created any events yet. Create your first event to get started!
          </Text>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('EventCreation')}
            style={styles.emptyButton}
          >
            Create Event
          </Button>
        </View>
      )}
      
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('EventCreation')}
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
  listContent: {
    padding: 16,
    paddingBottom: 80, // Extra padding for FAB
  },
  eventCard: {
    marginBottom: 12,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  eventCardContent: {
    padding: 16,
  },
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  eventIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  eventMeta: {
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
  registrationSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    marginVertical: 12,
  },
  registrationStatus: {
    flex: 1,
  },
  registrationLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.text,
  },
  daysRemaining: {
    fontSize: 12,
    color: Colors.textLight,
    marginTop: 4,
  },
  registerButton: {
    marginLeft: 12,
  },
  registerButtonText: {
    fontSize: 14,
  },
  eventActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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

export default EventsScreen;
