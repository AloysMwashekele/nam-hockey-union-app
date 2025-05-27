// Import React for building the component
import React from 'react';

// Import StyleSheet for custom styles from React Native
import { StyleSheet } from 'react-native';

// Import the Button component from React Native Paper and rename it to avoid conflicts
import { Button as PaperButton } from 'react-native-paper';

// Import custom color constants
import Colors from '../constants/colors';

// Functional component that wraps the PaperButton and adds custom styling and props
const Button = ({ 
  title,           // Text to be displayed inside the button
  onPress,         // Function to call when the button is pressed
  style,           // Additional custom styles for the button container
  textStyle,       // Additional custom styles for the button text
  disabled,        // Boolean to disable the button
  loading,         // Boolean to show a loading spinner
  mode = 'contained', // Mode of the button: 'contained', 'outlined', or 'text'
  icon,            // Optional icon to display in the button
  compact = false  // If true, button will be smaller in height and padding
}) => {
  return (
    <PaperButton
      mode={mode}                           // Sets button style: 'contained', 'outlined', or 'text'
      onPress={onPress}                     // Called when the button is pressed
      disabled={disabled}                   // Disables the button if true
      loading={loading}                     // Shows loading spinner if true
      icon={icon}                           // Displays icon if provided
      compact={compact}                     // Makes button more compact if true
      style={[
        styles.button,                      // Default button styles
        mode === 'outlined' && styles.outlinedButton, // Extra style if outlined mode is selected
        style                               // Any custom styles passed in
      ]}
      labelStyle={[
        styles.buttonText,                  // Default text style
        textStyle                           // Any custom text styles passed in
      ]}
      contentStyle={styles.buttonContent}   // Inner padding styling
    >
      {title}                                {/* Display the button title text */}
    </PaperButton>
  );
};

// Define styling for the button
const styles = StyleSheet.create({
  button: {
    marginVertical: 10,   // Adds vertical spacing around the button
    borderRadius: 8,      // Rounded corners
  },
  outlinedButton: {
    borderColor: Colors.primary, // Border color for outlined mode
    borderWidth: 1.5,            // Border thickness
  },
  buttonContent: {
    paddingVertical: 6,   // Vertical padding inside the button
  },
  buttonText: {
    fontSize: 16,         // Font size of the button text
    fontWeight: 'bold',   // Bold font weight
  },
});

// Export the component for use in other parts of the app
export default Button;
