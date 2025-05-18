import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { TextInput, Surface, IconButton } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import Button from '../components/Button';
import Colors from '../constants/colors';
import { registerUser } from '../utils/storage';

// SignupScreen component: handles user registration flow
const SignupScreen = ({ navigation }) => {
  // Local state for form inputs and UI feedback
  const [username, setUsername] = useState('');                 // Username input value
  const [email, setEmail] = useState('');                       // Email input value
  const [password, setPassword] = useState('');                 // Password input value
  const [confirmPassword, setConfirmPassword] = useState('');   // Confirm password input
  const [isLoading, setIsLoading] = useState(false);            // Loading indicator for signup process
  const [error, setError] = useState('');                       // Error message to display
  const [securePassword, setSecurePassword] = useState(true);   // Toggle show/hide password
  const [secureConfirmPassword, setSecureConfirmPassword] = useState(true); // Toggle show/hide confirm

  // Simple email format validation using regex
  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  // Handles the signup button press
  const handleSignup = async () => {
    setError('');  // Clear previous errors

    // Check that all fields are filled
    if (!username.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError('Please fill in all fields');
      return;
    }

    // Validate email format
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    // Ensure passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Enforce minimum password length
    if (password.length < 5) {
      setError('Password must be at least 5 characters long');
      return;
    }

    setIsLoading(true); // Show loading spinner on button

    try {
      // Attempt to register user via storage util
      const user = await registerUser({ username, email, password });

      // On success, navigate to Login screen and show confirmation
      navigation.navigate('Login', { registrationSuccess: true });
    } catch (error) {
      // Log and display any registration errors
      console.error('Registration error:', error);
      setError(error.message || 'Failed to register. Please try again.');
    } finally {
      setIsLoading(false); // Hide loading spinner
    }
  };

  return (
    <View style={styles.container}>
      {/* Header with back button and title */}
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          size={24}
          onPress={() => navigation.goBack()}           // Go back to previous screen
          color={Colors.text}
        />
        <Text style={styles.headerTitle}>Create Account</Text>
        {/* Spacer to center title */}
        <View style={{ width: 40 }} />
      </View>

      {/* Main scrollable content area */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>Join the Namibia Hockey community</Text>

        {/* Display error message if present */}
        {error ? (
          <Surface style={styles.errorContainer} elevation={1}>
            <MaterialCommunityIcons
              name="alert-circle-outline"
              size={20}
              color={Colors.error}
            />
            <Text style={styles.errorText}>{error}</Text>
          </Surface>
        ) : null}

        {/* Form inputs */}
        <View style={styles.formContainer}>
          <TextInput
            label="Username"
            value={username}
            onChangeText={setUsername}               // Update username state
            mode="outlined"
            left={<TextInput.Icon icon="account-outline" color={Colors.primary} />}
            style={styles.input}
            outlineColor={Colors.border}
            activeOutlineColor={Colors.primary}
            autoCapitalize="none"
          />

          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}                  // Update email state
            mode="outlined"
            left={<TextInput.Icon icon="email-outline" color={Colors.primary} />}
            style={styles.input}
            outlineColor={Colors.border}
            activeOutlineColor={Colors.primary}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}               // Update password state
            mode="outlined"
            left={<TextInput.Icon icon="lock-outline" color={Colors.primary} />}
            right={
              <TextInput.Icon
                icon={securePassword ? "eye-outline" : "eye-off-outline"}
                color={Colors.textLight}
                onPress={() => setSecurePassword(!securePassword)}  // Toggle visibility
              />
            }
            style={styles.input}
            outlineColor={Colors.border}
            activeOutlineColor={Colors.primary}
            secureTextEntry={securePassword}
          />

          <TextInput
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}        // Update confirm password state
            mode="outlined"
            left={<TextInput.Icon icon="lock-outline" color={Colors.primary} />}
            right={
              <TextInput.Icon
                icon={secureConfirmPassword ? "eye-outline" : "eye-off-outline"}
                color={Colors.textLight}
                onPress={() => setSecureConfirmPassword(!secureConfirmPassword)}
              />
            }
            style={styles.input}
            outlineColor={Colors.border}
            activeOutlineColor={Colors.primary}
            secureTextEntry={secureConfirmPassword}
          />
        </View>

        {/* Signup button triggers handleSignup */}
        <Button
          title={isLoading ? "Creating Account..." : "Sign Up"}
          onPress={handleSignup}
          mode="contained"
          disabled={isLoading}
          loading={isLoading}
          style={styles.signupButton}
        />

        {/* Link to Login for existing users */}
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>  {/* Navigate to Login */}
            <Text style={styles.loginLink}>Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

// Stylesheet for layout and theming
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,  // App-wide background color
  },
  header: {
    flexDirection: 'row',               // Arrange items horizontally
    justifyContent: 'space-between',    // Space out back button, title, and spacer
    alignItems: 'center',               // Center vertically
    paddingHorizontal: 8,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,   // Divider line under header
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textLight,
    marginBottom: 24,
    textAlign: 'center',  // Center subtitle text
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: Colors.errorLight,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: Colors.error,
    marginLeft: 8,
    flex: 1,
    fontSize: 14,
  },
  formContainer: {
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
    backgroundColor: Colors.background,
  },
  signupButton: {
    marginBottom: 24,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 32,
  },
  loginText: {
    fontSize: 14,
    color: Colors.textLight,
  },
  loginLink: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: 'bold',
    marginLeft: 4,
  },
});

export default SignupScreen;
