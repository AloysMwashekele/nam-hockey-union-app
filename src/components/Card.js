// Import React for building the component
import React from 'react';

// Import StyleSheet for styling from React Native
import { StyleSheet } from 'react-native';

// Import Card and TouchableRipple from React Native Paper, rename Card to avoid conflicts
import { Card as PaperCard, TouchableRipple } from 'react-native-paper';

// Import your custom color constants
import Colors from '../constants/colors';

// Reusable Card component that optionally supports pressing and titles
const Card = ({ 
  children,       // Content to display inside the card
  style,          // Custom styles for the card container
  onPress,        // Optional function to call when card is pressed
  title,          // Optional card title
  subtitle,       // Optional card subtitle
  left,           // Optional function/component to display on the left of the title
  right,          // Optional function/component to display on the right of the title
  elevation = 1   // Shadow depth of the card (default to 1)
}) => {

  // The actual card component to display
  const content = (
    <PaperCard 
      style={[styles.card, style]}     // Combine default and custom card styles
      elevation={elevation}            // Shadow depth
      mode="outlined"                  // Use outlined card style (with border)
    >
      {/* If either title or subtitle is provided, render the header */}
      {(title || subtitle) && (
        <PaperCard.Title 
          title={title} 
          subtitle={subtitle}
          left={left}
          right={right}
          titleStyle={styles.cardTitle}
          subtitleStyle={styles.cardSubtitle}
        />
      )}

      {/* Card body content */}
      <PaperCard.Content style={styles.cardContent}>
        {children}
      </PaperCard.Content>
    </PaperCard>
  );
  
  // If onPress is provided, wrap the card with a TouchableRipple for touch feedback
  if (onPress) {
    return (
      <TouchableRipple onPress={onPress} style={styles.touchable}>
        {content}
      </TouchableRipple>
    );
  }

  // If not pressable, just return the card as-is
  return content;
};

// Define component styles
const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.background, // Card background color
    marginVertical: 8,                  // Vertical spacing between cards
    borderColor: Colors.border,         // Border color for outlined mode
  },
  cardContent: {
    paddingHorizontal: 8,               // Horizontal padding for content
    paddingBottom: 16,                  // Extra padding at the bottom
  },
  cardTitle: {
    color: Colors.text,                 // Title text color
    fontWeight: 'bold',                 // Make title text bold
  },
  cardSubtitle: {
    color: Colors.textLight,            // Lighter color for subtitle
  },
  touchable: {
    borderRadius: 8,                    // Rounded edges for ripple effect
  }
});

// Export the Card component for use in other parts of the app
export default Card;
