import React, { useState, useContext } from 'react';
import { StyleSheet, View, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { Text, TextInput, Surface, Divider, IconButton } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import Button from '../components/Button';
import Colors from '../constants/colors';
import { loginUser } from '../utils/storage';
import { AuthContext } from '../context/AuthContext';

const LoginScreen = ({ navigation }) => {
  const { signIn } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [securePassword, setSecurePassword] = useState(true);

  const handleLogin = async () => {
    // Reset error
    setError('');
    
    // Validate input
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Attempt to login
      const user = await loginUser(username, password);
      
      // Use the signIn function from AuthContext to update authentication state
      signIn(user);
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Failed to login. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Login</Text>
      </View>
      
      <KeyboardAvoidingView 
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.logoContainer}>
            <Surface style={styles.logoSurface} elevation={1}>
              <MaterialCommunityIcons name="hockey-sticks" size={40} color={Colors.primary} />
            </Surface>
            <Text style={styles.appTitle}>Namibia Hockey</Text>
            <Text style={styles.appSubtitle}>Team Management</Text>
          </View>
          
          {error ? (
            <Surface style={styles.errorContainer} elevation={1}>
              <MaterialCommunityIcons name="alert-circle-outline" size={20} color={Colors.error} />
              <Text style={styles.errorText}>{error}</Text>
            </Surface>
          ) : null}
          
          <View style={styles.formContainer}>
            <TextInput
              label="Username"
              value={username}
              onChangeText={setUsername}
              mode="outlined"
              left={<TextInput.Icon icon="account-outline" color={Colors.primary} />}
              style={styles.input}
              outlineColor={Colors.border}
              activeOutlineColor={Colors.primary}
              autoCapitalize="none"
            />
            
            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              mode="outlined"
              left={<TextInput.Icon icon="lock-outline" color={Colors.primary} />}
              right={<TextInput.Icon icon={securePassword ? "eye-outline" : "eye-off-outline"} color={Colors.textLight} onPress={() => setSecurePassword(!securePassword)} />}
              style={styles.input}
              outlineColor={Colors.border}
              activeOutlineColor={Colors.primary}
              secureTextEntry={securePassword}
            />
          </View>
          
          <Button
            title={isLoading ? "Logging in..." : "Login"}
            onPress={handleLogin}
            mode="contained"
            disabled={isLoading}
            loading={isLoading}
            style={styles.loginButton}
          />
          
          <Divider style={styles.divider} />
          
          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text style={styles.signupLink}>Sign up</Text>
            </TouchableOpacity>
          </View>
          
          <Surface style={styles.helpContainer} elevation={1}>
            <Text style={styles.helpText}>Default admin credentials:</Text>
            <View style={styles.credentialsContainer}>
              <Text style={styles.credentialLabel}>Username:</Text>
              <Text style={styles.credentialValue}>admin123</Text>
            </View>
            <View style={styles.credentialsContainer}>
              <Text style={styles.credentialLabel}>Password:</Text>
              <Text style={styles.credentialValue}>12345</Text>
            </View>
          </Surface>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
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
  logoContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 32,
  },
  logoSurface: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
  },
  appTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.text,
  },
  appSubtitle: {
    fontSize: 14,
    color: Colors.textLight,
    marginTop: 4,
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
  loginButton: {
    marginBottom: 24,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginBottom: 24,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  signupText: {
    fontSize: 14,
    color: Colors.textLight,
  },
  signupLink: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  helpContainer: {
    padding: 16,
    marginBottom: 32,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  helpText: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  credentialsContainer: {
    flexDirection: 'row',
    marginBottom: 8,
    justifyContent: 'space-between',
  },
  credentialLabel: {
    fontSize: 14,
    color: Colors.textLight,
  },
  credentialValue: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
