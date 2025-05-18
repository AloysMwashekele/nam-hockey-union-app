import React from 'react';
import { StyleSheet } from 'react-native';
import { Card as PaperCard, TouchableRipple } from 'react-native-paper';
import Colors from '../constants/colors';

const Card = ({ children, style, onPress, title, subtitle, left, right, elevation = 1 }) => {
  const content = (
    <PaperCard 
      style={[styles.card, style]} 
      elevation={elevation}
      mode="outlined"
    >
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
      <PaperCard.Content style={styles.cardContent}>
        {children}
      </PaperCard.Content>
    </PaperCard>
  );
  
  if (onPress) {
    return (
      <TouchableRipple onPress={onPress} style={styles.touchable}>
        {content}
      </TouchableRipple>
    );
  }
  
  return content;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.background,
    marginVertical: 8,
    borderColor: Colors.border,
  },
  cardContent: {
    paddingHorizontal: 8,
    paddingBottom: 16,
  },
  cardTitle: {
    color: Colors.text,
    fontWeight: 'bold',
  },
  cardSubtitle: {
    color: Colors.textLight,
  },
  touchable: {
    borderRadius: 8,
  }
});

export default Card;
