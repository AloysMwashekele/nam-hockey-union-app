import React, { useState } from 'react';
import { StyleSheet, View, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Text, TextInput, Surface, Divider, Button as PaperButton, Menu, Chip } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import Button from '../components/Button';
import Colors from '../constants/colors';
import { saveTeam } from '../utils/storage';

const TeamRegistrationScreen = ({ navigation }) => {
  const [teamName, setTeamName] = useState('');
  const [category, setCategory] = useState('Men');
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const categoryOptions = [
    'Men', 'Women', 'Boys U18', 'Girls U18', 'Boys U16', 'Girls U16', 'Boys U14', 'Girls U14'
  ];
  
  const [division, setDivision] = useState('Premier');
  const [showDivisionMenu, setShowDivisionMenu] = useState(false);
  const divisionOptions = ['Premier', 'First', 'Second', 'Development'];
  
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!teamName || !category || !division || !contactName || !contactEmail || !contactPhone) {
      Alert.alert('Validation Error', 'Please fill in all required fields');
      return;
    }

    setIsLoading(true);

    try {
      const teamData = {
        name: teamName,
        category,
        division,
        contactName,
        contactEmail,
        contactPhone,
      };

      await saveTeam(teamData);
      
      setIsLoading(false);
      Alert.alert(
        'Success',
        'Team registration submitted successfully!',
        [
          {
            text: 'OK',
            onPress: () => {
              navigation.navigate('Teams');
            },
          },
        ]
      );
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Error', 'Failed to save team. Please try again.');
      console.error('Error saving team:', error);
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
          <Text variant="headlineSmall" style={styles.title}>Team Registration</Text>
          <Text variant="bodyMedium" style={styles.subtitle}>Register your team for the upcoming season</Text>
        </Surface>

        <View style={styles.container}>
          <Text variant="titleMedium" style={styles.formSectionTitle}>Team Information</Text>
          <Divider style={styles.divider} />

          <View style={styles.formGroup}>
            <TextInput
              label="Team Name *"
              value={teamName}
              onChangeText={setTeamName}
              mode="outlined"
              style={styles.input}
              outlineStyle={styles.inputOutline}
              left={<TextInput.Icon icon="shield" color={Colors.primary} />}
            />
          </View>

          <View style={styles.formGroup}>
            <Text variant="bodyMedium" style={styles.label}>Category *</Text>
            <Menu
              visible={showCategoryMenu}
              onDismiss={() => setShowCategoryMenu(false)}
              anchor={
                <PaperButton 
                  mode="outlined" 
                  onPress={() => setShowCategoryMenu(true)}
                  icon="chevron-down"
                  contentStyle={styles.dropdownButton}
                  style={styles.menuButton}
                >
                  {category}
                </PaperButton>
              }
            >
              {categoryOptions.map((option) => (
                <Menu.Item
                  key={option}
                  onPress={() => {
                    setCategory(option);
                    setShowCategoryMenu(false);
                  }}
                  title={option}
                  leadingIcon={category === option ? "check" : undefined}
                />
              ))}
            </Menu>
          </View>

          <View style={styles.categoryChips}>
            {categoryOptions.slice(0, 4).map((option) => (
              <Chip 
                key={option}
                selected={category === option}
                onPress={() => setCategory(option)}
                style={[styles.chip, category === option && styles.selectedChip]}
                textStyle={category === option ? styles.selectedChipText : styles.chipText}
                showSelectedCheck={false}
                compact
              >
                {option}
              </Chip>
            ))}
          </View>
          <View style={styles.categoryChips}>
            {categoryOptions.slice(4).map((option) => (
              <Chip 
                key={option}
                selected={category === option}
                onPress={() => setCategory(option)}
                style={[styles.chip, category === option && styles.selectedChip]}
                textStyle={category === option ? styles.selectedChipText : styles.chipText}
                showSelectedCheck={false}
                compact
              >
                {option}
              </Chip>
            ))}
          </View>

          <View style={styles.formGroup}>
            <Text variant="bodyMedium" style={styles.label}>Division *</Text>
            <View style={styles.divisionChips}>
              {divisionOptions.map((option) => (
                <Chip 
                  key={option}
                  selected={division === option}
                  onPress={() => setDivision(option)}
                  style={[styles.divisionChip, division === option && styles.selectedChip]}
                  textStyle={division === option ? styles.selectedChipText : styles.chipText}
                  showSelectedCheck={false}
                >
                  {option}
                </Chip>
              ))}
            </View>
          </View>

          <Text variant="titleMedium" style={styles.formSectionTitle}>Contact Information</Text>
          <Divider style={styles.divider} />

          <View style={styles.formGroup}>
            <TextInput
              label="Contact Person *"
              value={contactName}
              onChangeText={setContactName}
              mode="outlined"
              style={styles.input}
              outlineStyle={styles.inputOutline}
              left={<TextInput.Icon icon="account" color={Colors.primary} />}
            />
          </View>

          <View style={styles.formGroup}>
            <TextInput
              label="Email *"
              value={contactEmail}
              onChangeText={setContactEmail}
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
              value={contactPhone}
              onChangeText={setContactPhone}
              mode="outlined"
              style={styles.input}
              outlineStyle={styles.inputOutline}
              keyboardType="phone-pad"
              left={<TextInput.Icon icon="phone" color={Colors.primary} />}
            />
          </View>

          <Button
            title="Register Team"
            onPress={handleSubmit}
            loading={isLoading}
            disabled={isLoading}
            style={styles.submitButton}
            icon="shield-plus"
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
  categoryChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  chip: {
    margin: 4,
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderWidth: 1,
  },
  divisionChips: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  divisionChip: {
    flex: 1,
    marginHorizontal: 4,
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderWidth: 1,
  },
  selectedChip: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipText: {
    color: Colors.text,
  },
  selectedChipText: {
    color: Colors.background,
  },
  submitButton: {
    marginTop: 16,
  },
});

export default TeamRegistrationScreen;
