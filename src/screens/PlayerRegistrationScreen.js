import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Text, TextInput, Surface, Divider, Button as PaperButton, Menu, Modal, Portal, RadioButton, List } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

import Button from '../components/Button';
import Colors from '../constants/colors';
import { savePlayer, getTeams } from '../utils/storage';

const PlayerRegistrationScreen = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  // Gender state
  const [gender, setGender] = useState('Male');
  const [showGenderMenu, setShowGenderMenu] = useState(false);
  const genderOptions = ['Male', 'Female'];
  
  // Team state
  const [team, setTeam] = useState('');
  const [teamName, setTeamName] = useState('Select a team');
  const [showTeamMenu, setShowTeamMenu] = useState(false);
  const [teamOptions, setTeamOptions] = useState([]);
  
  // Position state
  const [position, setPosition] = useState('Forward');
  const [showPositionMenu, setShowPositionMenu] = useState(false);
  const positionOptions = ['Forward', 'Midfielder', 'Defender', 'Goalkeeper'];
  
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Load teams from storage
  useEffect(() => {
    const loadTeams = async () => {
      try {
        const storedTeams = await getTeams();
        // Format teams for dropdown
        const formattedTeams = storedTeams.map(team => ({
          name: team.name,
          id: team.id
        }));
        setTeamOptions(formattedTeams);
      } catch (error) {
        console.error('Error loading teams:', error);
      }
    };

    loadTeams();
  }, []);
  
  // Update team name when team id changes
  useEffect(() => {
    if (team) {
      const selectedTeam = teamOptions.find(t => t.id === team);
      if (selectedTeam) {
        setTeamName(selectedTeam.name);
      }
    }
  }, [team, teamOptions]);

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || dateOfBirth;
    setShowDatePicker(false);
    setDateOfBirth(currentDate);
  };

  const handleSubmit = async () => {
    if (!firstName || !lastName || !team || !email || !phone) {
      Alert.alert('Validation Error', 'Please fill in all required fields');
      return;
    }

    setIsLoading(true);

    try {
      const playerData = {
        firstName,
        lastName,
        dateOfBirth: dateOfBirth.toISOString().split('T')[0],
        gender,
        teamId: team,
        position,
        email,
        phone,
      };

      await savePlayer(playerData);
      
      setIsLoading(false);
      Alert.alert(
        'Success',
        'Player registration submitted successfully!',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Error', 'Failed to save player. Please try again.');
      console.error('Error saving player:', error);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Surface style={styles.headerSection} elevation={1}>
          <Text variant="headlineSmall" style={styles.title}>Player Registration</Text>
          <Text variant="bodyMedium" style={styles.subtitle}>Register as a player in the Namibia Hockey Union</Text>
        </Surface>

        <View style={styles.container}>
          <Text variant="titleMedium" style={styles.formSectionTitle}>Personal Information</Text>
          <Divider style={styles.divider} />

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

          <Text variant="titleMedium" style={styles.formSectionTitle}>Contact Information</Text>
          <Divider style={styles.divider} />

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
    color: Colors.background + 'CC', // Adding transparency
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
