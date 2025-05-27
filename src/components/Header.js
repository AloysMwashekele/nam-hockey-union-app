// Import core React and React Native components
import React from 'react';
import { StyleSheet, Image, View } from 'react-native';

// Import Appbar from React Native Paper
import { Appbar } from 'react-native-paper';

// Import your custom color palette
import Colors from '../constants/colors';

// Reusable Header component
const Header = ({ 
  title,             // Main title text
  showLogo = true,   // Whether to show the app logo
  onBackPress,       // Optional function for back button
  rightActions,      // Optional component(s) on the right (e.g. icons)
  subtitle,          // Optional subtitle text
  elevation = 4      // Shadow depth (default is 4)
}) => {
  return (
    <Appbar.Header 
      style={[styles.header, { elevation }]}  // Add dynamic shadow depth
      mode="small"                            // Smaller header height
    >
      {/* Show back button only if onBackPress is provided */}
      {onBackPress && (
        <Appbar.BackAction 
          onPress={onBackPress} 
          color={Colors.background} 
        />
      )}
      
      {/* Show logo if enabled */}
      {showLogo && (
        <View style={styles.logoContainer}>
          <Image 
            source={require('../../assets/icon.png')}  // Replace with your logo path
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
      )}
      
      {/* Display title and optional subtitle */}
      <Appbar.Content 
        title={title}
        subtitle={subtitle}
        titleStyle={styles.headerText}
        subtitleStyle={styles.subtitleText}
      />
      
      {/* Render any additional actions on the right side */}
      {rightActions}
    </Appbar.Header>
  );
};

// Styles for the Header component
const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.primary,  // Background color of the header
  },
  logoContainer: {
    marginRight: 10,                  // Space between logo and text
    justifyContent: 'center',
  },
  logo: {
    width: 28,
    height: 28,
  },
  headerText: {
    color: Colors.background,         // Text color for title
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtitleText: {
    color: Colors.background + 'CC',  // Slightly transparent subtitle color
    fontSize: 14,
  }
});

// Export the Header so it can be used elsewhere
export default Header;
