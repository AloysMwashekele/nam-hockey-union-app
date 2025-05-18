import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator } from 'react-native-paper';
import { FontAwesome5 } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import TeamsScreen from '../screens/TeamsScreen';
import PlayersScreen from '../screens/PlayersScreen';
import EventsScreen from '../screens/EventsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import TeamRegistrationScreen from '../screens/TeamRegistrationScreen';
import PlayerRegistrationScreen from '../screens/PlayerRegistrationScreen';
import EventRegistrationScreen from '../screens/EventRegistrationScreen';
import TeamDetailsScreen from '../screens/TeamDetailsScreen';
import PlayerDetailsScreen from '../screens/PlayerDetailsScreen';
import EventDetailsScreen from '../screens/EventDetailsScreen';
import EventCreationScreen from '../screens/EventCreationScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import AnnouncementsScreen from '../screens/AnnouncementsScreen';

import { AuthContext, AuthProvider } from '../context/AuthContext';

import Colors from '../constants/colors';

const Tab = createBottomTabNavigator();
const AuthStack = createNativeStackNavigator();
const HomeStack = createNativeStackNavigator();
const TeamsStack = createNativeStackNavigator();
const PlayersStack = createNativeStackNavigator();
const EventsStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();
const RootStack = createNativeStackNavigator();

const HomeStackNavigator = () => {
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.primary,
        },
        headerTintColor: Colors.background,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerShadowVisible: false,
        contentStyle: {
          backgroundColor: Colors.surface,
        },
      }}
    >
      <HomeStack.Screen name="Home" component={HomeScreen} options={{ title: 'Namibia Hockey' }} />
      <HomeStack.Screen name="Announcements" component={AnnouncementsScreen} options={{ title: 'Announcements' }} />
    </HomeStack.Navigator>
  );
};

const TeamsStackNavigator = () => {
  return (
    <TeamsStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.primary,
        },
        headerTintColor: Colors.background,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerShadowVisible: false,
        contentStyle: {
          backgroundColor: Colors.surface,
        },
      }}
    >
      <TeamsStack.Screen name="Teams" component={TeamsScreen} options={{ title: 'Teams' }} />
      <TeamsStack.Screen name="TeamRegistration" component={TeamRegistrationScreen} options={{ title: 'Register Team' }} />
      <TeamsStack.Screen name="TeamDetails" component={TeamDetailsScreen} options={{ title: 'Team Details' }} />
    </TeamsStack.Navigator>
  );
};

const PlayersStackNavigator = () => {
  return (
    <PlayersStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.primary,
        },
        headerTintColor: Colors.background,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerShadowVisible: false,
        contentStyle: {
          backgroundColor: Colors.surface,
        },
      }}
    >
      <PlayersStack.Screen name="Players" component={PlayersScreen} options={{ title: 'Players' }} />
      <PlayersStack.Screen name="PlayerRegistration" component={PlayerRegistrationScreen} options={{ title: 'Register Player' }} />
      <PlayersStack.Screen name="PlayerDetails" component={PlayerDetailsScreen} options={{ title: 'Player Details' }} />
    </PlayersStack.Navigator>
  );
};

const EventsStackNavigator = () => {
  return (
    <EventsStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.primary,
        },
        headerTintColor: Colors.background,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerShadowVisible: false,
        contentStyle: {
          backgroundColor: Colors.surface,
        },
      }}
    >
      <EventsStack.Screen name="Events" component={EventsScreen} options={{ title: 'Events' }} />
      <EventsStack.Screen name="EventRegistration" component={EventRegistrationScreen} options={{ title: 'Register for Event' }} />
      <EventsStack.Screen name="EventDetails" component={EventDetailsScreen} options={{ title: 'Event Details' }} />
      <EventsStack.Screen name="EventCreation" component={EventCreationScreen} options={{ title: 'Create Event' }} />
    </EventsStack.Navigator>
  );
};

const ProfileStackNavigator = () => {
  return (
    <ProfileStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.primary,
        },
        headerTintColor: Colors.background,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerShadowVisible: false,
        contentStyle: {
          backgroundColor: Colors.surface,
        },
      }}
    >
      <ProfileStack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
    </ProfileStack.Navigator>
  );
};

const AuthStackNavigator = () => {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.primary,
        },
        headerTintColor: Colors.background,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerShadowVisible: false,
        contentStyle: {
          backgroundColor: Colors.surface,
        },
      }}
    >
      <AuthStack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <AuthStack.Screen name="Signup" component={SignupScreen} options={{ title: 'Create Account' }} />
    </AuthStack.Navigator>
  );
};

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let solid = focused;

          if (route.name === 'HomeTab') {
            iconName = 'home';
          } else if (route.name === 'TeamsTab') {
            iconName = 'users';
          } else if (route.name === 'PlayersTab') {
            iconName = 'user';
          } else if (route.name === 'EventsTab') {
            iconName = 'calendar-alt';
          } else if (route.name === 'ProfileTab') {
            iconName = 'cog';
          }

          return <FontAwesome5 name={iconName} size={size} color={color} solid={solid} />;
        },
        tabBarActiveTintColor: Colors.accent,
        tabBarInactiveTintColor: Colors.background,
        tabBarStyle: {
          backgroundColor: Colors.primary,
          borderTopWidth: 0,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
          elevation: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          fontFamily: 'System',
        },
        tabBarItemStyle: {
          paddingVertical: 5,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeStackNavigator} options={{ title: 'Home' }} />
      <Tab.Screen name="TeamsTab" component={TeamsStackNavigator} options={{ title: 'Teams' }} />
      <Tab.Screen name="PlayersTab" component={PlayersStackNavigator} options={{ title: 'Players' }} />
      <Tab.Screen name="EventsTab" component={EventsStackNavigator} options={{ title: 'Events' }} />
      <Tab.Screen name="ProfileTab" component={ProfileStackNavigator} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppContent />
      </NavigationContainer>
    </AuthProvider>
  );
};

const AppContent = () => {
  const { isLoading, userToken } = useContext(AuthContext);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {userToken ? (
        <RootStack.Screen name="Main" component={MainTabNavigator} />
      ) : (
        <RootStack.Screen name="Auth" component={AuthStackNavigator} />
      )}
    </RootStack.Navigator>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: Colors.surface,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.primary,
    fontWeight: 'bold',
  }
});

export default AppNavigator;
