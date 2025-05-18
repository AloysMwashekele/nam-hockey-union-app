import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { Text, Divider, Avatar, Chip, Badge, Card, ActivityIndicator } from 'react-native-paper';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import Button from '../components/Button';
import Colors from '../constants/colors';
import { getAnnouncements } from '../utils/storage';
import { AuthContext } from '../context/AuthContext';

const HomeScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [announcements, setAnnouncements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch announcements from storage
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setIsLoading(true);
        const data = await getAnnouncements();
        // Only show the 3 most recent announcements on home screen
        setAnnouncements(data.slice(0, 3));
      } catch (error) {
        console.error('Error fetching announcements:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={Colors.background} barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Namibia Hockey</Text>
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Announcements')}>
              <Ionicons name="notifications-outline" size={24} color={Colors.text} />
              {announcements.length > 0 && (
                <Badge style={styles.badge}>{announcements.length}</Badge>
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('ProfileTab')}>
              <Avatar.Text 
                size={36} 
                label={user?.username?.charAt(0) || 'P'} 
                color={Colors.text} 
                style={styles.avatar}
              />
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.welcomeText}>Welcome, {user?.username || 'Player'}</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={() => navigation.navigate('TeamsTab', { screen: 'TeamRegistration' })}
          >
            <View style={styles.quickActionIcon}>
              <Ionicons name="people" size={24} color={Colors.primary} />
            </View>
            <Text style={styles.quickActionText}>Register Team</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={() => navigation.navigate('PlayersTab', { screen: 'PlayerRegistration' })}
          >
            <View style={styles.quickActionIcon}>
              <Ionicons name="person-add" size={24} color={Colors.primary} />
            </View>
            <Text style={styles.quickActionText}>Register Player</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={() => navigation.navigate('EventsTab', { screen: 'EventRegistration' })}
          >
            <View style={styles.quickActionIcon}>
              <Ionicons name="calendar" size={24} color={Colors.primary} />
            </View>
            <Text style={styles.quickActionText}>Register for Event</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Overview */}
        <View style={styles.statsContainer}>
          <Card style={styles.statsCard}>
            <Card.Content>
              <View style={styles.statsHeader}>
                <Text style={styles.statsTitle}>Teams</Text>
                <TouchableOpacity onPress={() => navigation.navigate('TeamsTab')}>
                  <Ionicons name="chevron-forward" size={20} color={Colors.primary} />
                </TouchableOpacity>
              </View>
              <View style={styles.statsContent}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>12</Text>
                  <Text style={styles.statLabel}>Teams</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>3</Text>
                  <Text style={styles.statLabel}>Categories</Text>
                </View>
              </View>
            </Card.Content>
          </Card>
          
          <Card style={styles.statsCard}>
            <Card.Content>
              <View style={styles.statsHeader}>
                <Text style={styles.statsTitle}>Players</Text>
                <TouchableOpacity onPress={() => navigation.navigate('PlayersTab')}>
                  <Ionicons name="chevron-forward" size={20} color={Colors.primary} />
                </TouchableOpacity>
              </View>
              <View style={styles.statsContent}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>85</Text>
                  <Text style={styles.statLabel}>Players</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>4</Text>
                  <Text style={styles.statLabel}>Positions</Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        </View>

        {/* Upcoming Events */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Events</Text>
            <TouchableOpacity onPress={() => navigation.navigate('EventsTab')}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.eventsScrollContent}>
            <TouchableOpacity 
              style={styles.eventCard} 
              onPress={() => navigation.navigate('EventsTab', { screen: 'EventDetails', params: { eventId: 1 } })}
            >
              <View style={styles.eventCardHeader}>
                <View style={styles.eventIconContainer}>
                  <Ionicons name="calendar" size={20} color={Colors.background} />
                </View>
                <Chip style={styles.eventChip}>Open</Chip>
              </View>
              <Text style={styles.eventTitle}>National Championship</Text>
              <Text style={styles.eventDate}>May 15 - 20, 2023</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.eventCard} 
              onPress={() => navigation.navigate('EventsTab', { screen: 'EventDetails', params: { eventId: 2 } })}
            >
              <View style={styles.eventCardHeader}>
                <View style={styles.eventIconContainer}>
                  <Ionicons name="calendar" size={20} color={Colors.background} />
                </View>
                <Chip style={styles.eventChip}>U21</Chip>
              </View>
              <Text style={styles.eventTitle}>Regional Tournament</Text>
              <Text style={styles.eventDate}>June 5 - 10, 2023</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.eventCard} 
              onPress={() => navigation.navigate('EventsTab', { screen: 'EventDetails', params: { eventId: 3 } })}
            >
              <View style={styles.eventCardHeader}>
                <View style={styles.eventIconContainer}>
                  <Ionicons name="calendar" size={20} color={Colors.background} />
                </View>
                <Chip style={styles.eventChip}>Women</Chip>
              </View>
              <Text style={styles.eventTitle}>Club Finals</Text>
              <Text style={styles.eventDate}>July 8 - 12, 2023</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Announcements */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Announcements</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Announcements')}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={Colors.primary} />
              <Text style={styles.loadingText}>Loading announcements...</Text>
            </View>
          ) : announcements.length === 0 ? (
            <Card style={styles.emptyCard}>
              <Card.Content style={styles.emptyContainer}>
                <Ionicons name="information-circle-outline" size={24} color={Colors.textLight} />
                <Text style={styles.emptyText}>No announcements available</Text>
              </Card.Content>
            </Card>
          ) : (
            <Card style={styles.announcementsCard}>
              <Card.Content>
                {announcements.map((announcement, index) => (
                  <React.Fragment key={announcement.id || index}>
                    <TouchableOpacity 
                      style={styles.announcementItem}
                      onPress={() => navigation.navigate('Announcements')}
                    >
                      <View style={styles.announcementHeader}>
                        <View style={styles.announcementTitleRow}>
                          <MaterialCommunityIcons name="bullhorn" size={20} color={Colors.primary} />
                          <View style={styles.announcementTitleContainer}>
                            <Text style={styles.announcementTitle}>{announcement.title}</Text>
                            <Text style={styles.announcementDate}>{announcement.date}</Text>
                          </View>
                        </View>
                        {announcement.important && (
                          <Chip style={styles.importantChip}>Important</Chip>
                        )}
                      </View>
                      <Text style={styles.announcementMessage} numberOfLines={2}>
                        {announcement.message}
                      </Text>
                    </TouchableOpacity>
                    {index < announcements.length - 1 && <Divider style={styles.divider} />}
                  </React.Fragment>
                ))}
              </Card.Content>
            </Card>
          )}
        </View>
      </ScrollView>
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
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginRight: 16,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: Colors.error,
    size: 16,
  },
  avatar: {
    backgroundColor: Colors.primary,
  },
  welcomeText: {
    fontSize: 16,
    color: Colors.textLight,
  },
  scrollView: {
    flex: 1,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  quickActionButton: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 4,
    padding: 12,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    color: Colors.text,
    textAlign: 'center',
  },
  statsContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  statsCard: {
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    elevation: 1,
  },
  statsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
  },
  statsContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    padding: 8,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textLight,
    marginTop: 4,
  },
  sectionContainer: {
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  viewAllText: {
    fontSize: 14,
    color: Colors.primary,
  },
  eventsScrollContent: {
    paddingBottom: 8,
    paddingTop: 4,
  },
  eventCard: {
    width: 160,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  eventCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  eventIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventChip: {
    backgroundColor: Colors.accent,
    height: 24,
  },
  eventTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  eventDate: {
    fontSize: 12,
    color: Colors.textLight,
  },
  emptyCard: {
    borderRadius: 12,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: 'dashed',
  },
  emptyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  emptyText: {
    color: Colors.textLight,
    marginLeft: 8,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  loadingText: {
    color: Colors.textLight,
    marginLeft: 8,
  },
  announcementsCard: {
    borderRadius: 12,
    backgroundColor: Colors.surface,
    elevation: 1,
  },
  announcementItem: {
    paddingVertical: 12,
  },
  announcementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  announcementTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  announcementTitleContainer: {
    marginLeft: 8,
    flex: 1,
  },
  announcementTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.text,
  },
  announcementDate: {
    fontSize: 12,
    color: Colors.textLight,
  },
  announcementMessage: {
    fontSize: 13,
    color: Colors.text,
    lineHeight: 18,
  },
  importantChip: {
    backgroundColor: Colors.error,
    height: 24,
  },
  divider: {
    backgroundColor: Colors.divider,
    height: 1,
    marginVertical: 4,
  },
});

export default HomeScreen;
