import React from 'react';
import { StyleSheet, Image, View } from 'react-native';
import { Appbar } from 'react-native-paper';
import Colors from '../constants/colors';

const Header = ({ 
  title, 
  showLogo = true, 
  onBackPress, 
  rightActions,
  subtitle,
  elevation = 4
}) => {
  return (
    <Appbar.Header 
      style={[styles.header, { elevation }]} 
      mode="small"
    >
      {onBackPress && (
        <Appbar.BackAction onPress={onBackPress} color={Colors.background} />
      )}
      
      {showLogo && (
        <View style={styles.logoContainer}>
          <Image 
            source={require('../../assets/icon.png')} 
            style={styles.logo} 
            resizeMode="contain"
          />
        </View>
      )}
      
      <Appbar.Content 
        title={title} 
        subtitle={subtitle}
        titleStyle={styles.headerText}
        subtitleStyle={styles.subtitleText}
      />
      
      {rightActions}
    </Appbar.Header>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.primary,
  },
  logoContainer: {
    marginRight: 10,
    justifyContent: 'center',
  },
  logo: {
    width: 28,
    height: 28,
  },
  headerText: {
    color: Colors.background,
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtitleText: {
    color: Colors.background + 'CC', // Adding transparency
    fontSize: 14,
  }
});

export default Header;
