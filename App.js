import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, LogBox, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider, MD3LightTheme, Button, ActivityIndicator } from 'react-native-paper';

import AppNavigator from './src/navigation/AppNavigator';
import Colors from './src/constants/colors';
import { initializeStorage } from './src/utils/storage';

// Configure the Paper theme with our colors
const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: Colors.primary,
    secondary: Colors.accent,
    error: Colors.error,
    background: Colors.background,
    surface: Colors.surface,
    text: Colors.text,
    onSurface: Colors.text,
    disabled: Colors.disabled,
    placeholder: Colors.textLight,
    backdrop: Colors.backdrop,
    notification: Colors.primary,
  },
  roundness: 8,
};

// Ignore specific warnings
LogBox.ignoreLogs([
  'Sending `onAnimatedValueUpdate` with no listeners registered.',
  'Non-serializable values were found in the navigation state',
]);

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: 20,
  },
  loadingText: {
    fontSize: 20,
    color: Colors.primary,
    marginBottom: 24,
    fontWeight: 'bold',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: Colors.danger || 'red',
    marginBottom: 10,
  },
  errorMessage: {
    fontSize: 16,
    color: Colors.secondary,
    marginBottom: 20,
    textAlign: 'center',
  }
});

export default function App() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState(null);
  
  // Initialize async storage with sample data if empty
  useEffect(() => {
    const initialize = async () => {
      try {
        console.log('Initializing async storage...');
        await initializeStorage();
        console.log('Async storage initialized successfully');
        setIsInitialized(true);
      } catch (error) {
        console.error('Error initializing storage:', error);
        setError(error.message);
      }
    };
    
    initialize();
  }, []);
  
  // Show loading screen while initializing
  if (!isInitialized && !error) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading Namibia Hockey</Text>
      </View>
    );
  }
  
  // Show error screen if initialization failed
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error initializing app:</Text>
        <Text style={styles.errorMessage}>{error}</Text>
        <Button mode="contained" onPress={() => window.location.reload()}>
          Retry
        </Button>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <StatusBar style="light" backgroundColor={Colors.primary} />
        <AppNavigator />
      </PaperProvider>
    </SafeAreaProvider>
  );
}
