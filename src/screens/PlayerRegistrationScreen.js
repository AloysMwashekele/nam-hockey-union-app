// Import necessary modules and components from React and React Native
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Text, TextInput, Surface, Divider, Button as PaperButton, Menu, Modal, Portal, RadioButton, List } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

// Import custom components and utilities
import Button from '../components/Button'; // (Unused in this file)
import Colors from '../constants/colors'; // Custom color constants
import { savePlayer, getTeams } from '../utils/storage'; // Storage utility functions

// Main component for the player registration screen
const PlayerRegistrationScreen = ({ navigation }) => {
  // State variables for form inputs
  const [firstName, setFirstName] = useState(''); // Player's first name
  const [lastName, setLastName] = useState('');   // Player's last name
  const [dateOfBirth, setDateOfBirth] = useState(new Date()); // Player's date of birth
  const [showDatePicker, setShowDatePicker] = useState(false); // Controls visibility of date picker

  // Gender selection state
  const [gender, setGender] = useState('Male'); // Default gender
  const [showGenderMenu, setShowGenderMenu] = useState(false); // Controls gender dropdown visibility
  const genderOptions = ['Male', 'Female']; // Gender options

  // Team selection state
  const [team, setTeam] = useState(''); // Selected team ID
  const [teamName, setTeamName] = useState('Select a team'); // Displayed team name
  const [showTeamMenu, setShowTeamMenu] = useState(false); // Controls team dropdown visibility
  const [teamOptions, setTeamOptions] = useState([]); // List of available teams

  // Position selection state
  const [position, setPosition] = useState('Forward'); // Default player position
  const [showPositionMenu, setShowPositionMenu] = useState(false); // Controls position dropdown visibility
  const positionOptions = ['Forward', 'Midfielder', 'Defender', 'Goalkeeper']; // Available positions

  // Contact information
  const [email, setEmail] = useState(''); // Player email
  const [phone, setPhone] = useState(''); // Player phone number
  const [isLoading, setIsLoading] = useState(false); // Loading state for form submission

  // Load team options from local storage on component mount
  useEffect(() => {
    const loadTeams = async () => {
      try {
        const storedTeams = await getTeams(); // Fetch teams from storage
        const formattedTeams = storedTeams.map(team => ({
          name: team.name,
          id: team.id
        }));
        setTeamOptions(formattedTeams); // Set formatted teams to dropdown options
      } catch (error) {
        console.error('Error loading teams:', error); // Log if something goes wrong
      }
    };

    loadTeams(); // Call the loader
  }, []); // Only run once on mount

  // Automatically update team display name when a team ID is selected
  useEffect(() => {
    if (team) {
      const selectedTeam = teamOptions.find(t => t.id === team);
      if (selectedTeam) {
        setTeamName(selectedTeam.name); // Update displayed name
      }
    }
  }, [team, teamOptions]); // Runs when either team or teamOptions changes

  // Handle date picker change
  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || dateOfBirth; // Default to previous date if cancelled
    setShowDatePicker(false); // Close picker
    setDateOfBirth(currentDate); // Update state
  };

  // Form submission handler
  const handleSubmit = async () => {
    // Validate required fields
    if (!firstName || !lastName || !team || !email || !phone) {
      Alert.alert('Validation Error', 'Please fill in all required fields');
      return;
    }

    setIsLoading(true); // Show loading indicator

    try {
      const playerData = {
        firstName,
        lastName,
        dateOfBirth: dateOfBirth.toISOString().split('T')[0], // Format DOB as yyyy-mm-dd
        gender,
        teamId: team,
        position,
        email,
        phone,
      };

      await savePlayer(playerData); // Save player data

      setIsLoading(false);
      Alert.alert(
        'Success',
        'Player registration submitted successfully!',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(), // Navigate back to previous screen
          },
        ]
      );
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Error', 'Failed to save player. Please try again.'); // Show error
      console.error('Error saving player:', error); // Log error
    }
  };

  // Main UI rendering
  return (
    <KeyboardAvoidingView 
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // Adjust keyboard behavior
      keyboardVerticalOffset={100} // Space between keyboard and form
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <Surface style={styles.headerSection} elevation={1}>
          <Text variant="headlineSmall" style={styles.title}>Player Registration</Text>
          <Text variant="bodyMedium" style={styles.subtitle}>Register as a player in the Namibia Hockey Union</Text>
        </Surface>

        {/* Form container */}
        <View style={styles.container}>
          {/* Personal Info Section */}
          <Text variant="titleMedium" style={styles.formSectionTitle}>Personal Information</Text>
          <Divider style={styles.divider} />

          {/* First Name Input */}
          <View style={styles.formGroup}>
            <TextInput
              label="First Name *"
              value={firstName}
              onChangeText={setFirstName}
              mode="outlined"
              style={styles.input}
              outlineStyle={styles.inputOutline}
              left={<TextInput.Icon icon="account" color={Colors.primary} />}
            />
          </View>

          {/* Last Name Input */}
          <View style={styles.formGroup}>
            <TextInput
              label="Last Name *"
              value={lastName}
              onChangeText={setLastName}
              mode="outlined"
              style={styles.input}
              outlineStyle={styles.inputOutline}
              left={<TextInput.Icon icon="account" color={Colors.primary} />}
            />
          </View>

          {/* Date of Birth Picker */}
          <View style={styles.formGroup}>
            <Text variant="bodyMedium" style={styles.label}>Date of Birth *</Text>
            <PaperButton
              title={dateOfBirth.toLocaleDateString()}
              onPress={() => setShowDatePicker(true)}
              mode="outlined"
              icon="calendar"
              style={styles.dateButton}
            />
            {showDatePicker && (
              <DateTimePicker
                value={dateOfBirth}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            )}
          </View>

          {/* Gender Dropdown */}
          <View style={styles.formGroup}>
            <Text variant="bodyMedium" style={styles.label}>Gender *</Text>
            <Menu
              visible={showGenderMenu}
              onDismiss={() => setShowGenderMenu(false)}
              anchor={
                <PaperButton 
                  mode="outlined" 
                  onPress={() => setShowGenderMenu(true)}
                  icon="chevron-down"
                  contentStyle={styles.dropdownButton}
                  style={styles.menuButton}
                >
                  {gender}
                </PaperButton>
              }
            >
              {genderOptions.map((option) => (
                <Menu.Item
                  key={option}
                  onPress={() => {
                    setGender(option);
                    setShowGenderMenu(false);
                  }}
                  title={option}
                  leadingIcon={gender === option ? "check" : undefined}
                />
              ))}
            </Menu>
          </View>

          {/* Team Dropdown */}
          <View style={styles.formGroup}>
            <Text variant="bodyMedium" style={styles.label}>Team *</Text>
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
                  {teamName}
                </PaperButton>
              }
            >
              {teamOptions.length > 0 ? (
                teamOptions.map((option) => (
                  <Menu.Item
                    key={option.id}
                    onPress={() => {
                      setTeam(option.id);
                      setTeamName(option.name);
                      setShowTeamMenu(false);
                    }}
                    title={option.name}
                    leadingIcon={team === option.id ? "check" : undefined}
                  />
                ))
              ) : (
                <Menu.Item title="No teams available" disabled />
              )}
            </Menu>
          </View>

          {/* Position Dropdown */}
          <View style={styles.formGroup}>
            <Text variant="bodyMedium" style={styles.label}>Position *</Text>
            <Menu
              visible={showPositionMenu}
              onDismiss={() => setShowPositionMenu(false)}
              anchor={
                <PaperButton 
                  mode="outlined" 
                  onPress={() => setShowPositionMenu(true)}
                  icon="chevron-down"
                  contentStyle={styles.dropdownButton}
                  style={styles.menuButton}
                >
                  {position}
                </PaperButton>
              }
            >
              {positionOptions.map((option) => (
                <Menu.Item
                  key={option}
                  onPress={() => {
                    setPosition(option);
                    setShowPositionMenu(false);
                  }}
                  title={option}
                  leadingIcon={position === option ? "check" : undefined}
                />
              ))}
            </Menu>
          </View>

          {/* Contact Info Section */}
          <Text variant="titleMedium" style={styles.formSectionTitle}>Contact Information</Text>
          <Divider style={styles.divider} />

          {/* Email Input */}
          <View style={styles.formGroup}>
            <TextInput
              label="Email *"
              value={email}
              onChangeText={setEmail}
              mode="outlined"
              style={styles.input}
              outlineStyle={styles.inputOutline}
              keyboardType="email-address"
              autoCapitalize="none"
              left={<TextInput.Icon icon="email" color={Colors.primary} />}
            />
          </View>

          {/* Phone Input */}
          <View style={styles.formGroup}>
            <TextInput
              label="Phone Number *"
              value={phone}
              onChangeText={setPhone}
              mode="outlined"
              style={styles.input}
              outlineStyle={styles.inputOutline}
              keyboardType="phone-pad"
              left={<TextInput.Icon icon="phone" color={Colors.primary} />}
            />
          </View>

          {/* Submit Button */}
          <PaperButton
            title="Register Player"
            onPress={handleSubmit}
            loading={isLoading}
            disabled={isLoading}
            style={styles.submitButton}
            icon="account-plus"
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// Styles for the component
const styles = StyleSheet.create({
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
    color: Colors.background + 'CC',
  },
  formSectionTitle: {
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  divider: {
    marginBottom: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    color: Colors.text,
  },
  input: {
    backgroundColor: Colors.background,
  },
  inputOutline: {
    borderRadius: 8,
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
  dateButton: {
    borderColor: Colors.border,
  },
  submitButton: {
    marginTop: 16,
  },
});

export default PlayerRegistrationScreen;
