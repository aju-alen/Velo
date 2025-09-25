import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, Image, Animated, Easing, useColorScheme } from 'react-native';
import { TouchableOpacity } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import CustomButton from '@/components/CustomButton';
import { verticalScale, horizontalScale, moderateScale } from '@/constants/metrics';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';

const ChooseRole = () => {
  const [role, setRole] = useState('USER');
  const userBlobAnim = useRef(new Animated.Value(1)).current;
  const agentBlobAnim = useRef(new Animated.Value(0)).current;
  
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];

  const handleContinueRegister = () => {
    if (role === 'GUEST') {
      router.replace({ pathname: '/(auth)/guestOnboarding' });
    } else {
      router.replace({ pathname: "/register", params: { role } });
    }
  };

  const handlePress = (selectedRole) => {
    setRole(selectedRole);

    if (selectedRole === 'USER') {
      Animated.timing(userBlobAnim, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.exp),
        useNativeDriver: false,
      }).start();
      Animated.timing(agentBlobAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: false,
      }).start();
    } else if (selectedRole === 'AGENT') {
      Animated.timing(agentBlobAnim, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.exp),
        useNativeDriver: false,
      }).start();
      Animated.timing(userBlobAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: false,
      }).start();
    } else if (selectedRole === 'GUEST') {
      Animated.timing(agentBlobAnim, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.exp),
        useNativeDriver: false,
      }).start();
      Animated.timing(userBlobAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: false,
      }).start();
    }
  };

  const blobStyle = (blobAnim) => ({
    transform: [
      {
        scale: blobAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1.0],
        }),
      },
    ],
    opacity: blobAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 0.6],
    }),
  });

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/paralax.png')}
          style={styles.reactLogo}
        />
      }>
      <View style={[styles.container, { backgroundColor: themeColors.background }]}>
        <Text style={[styles.title, { color: themeColors.text }]}>Select Role</Text>

        <View style={styles.cardsContainer}>
          {/* User Role Card */}
          <TouchableOpacity 
            style={[
              styles.card,
              role === 'USER' && styles.selectedCard
            ]}
            onPress={() => handlePress('USER')}
          >
            <Animated.View style={[styles.blobBackground, blobStyle(userBlobAnim)]} />
            <View style={[styles.cardContent, { backgroundColor: themeColors.background }]}>
           
              <View style={styles.textContainer}>
                <Text style={[styles.roleTitle, { color: themeColors.text }]}>
                  I am a Sender
                </Text>
                <Text style={[styles.roleDescription, { color: themeColors.text }]}>
                Sign up to connect with logistics agents and manage your shipments. Move your goods with ease.
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Agent Role Card */}
          <TouchableOpacity 
            style={[
              styles.card,
              role === 'AGENT' && styles.selectedCard
            ]}
            onPress={() => handlePress('AGENT')}
          >
            <Animated.View style={[styles.blobBackground, blobStyle(agentBlobAnim)]} />
            <View style={[styles.cardContent, { backgroundColor: themeColors.background }]}>
            
              <View style={styles.textContainer}>
                <Text style={[styles.roleTitle, { color: themeColors.text }]}>
                  I am an Logistics Agent
                </Text>
                <Text style={[styles.roleDescription, { color: themeColors.text }]}>
                Log in to coordinate shipments and simplify the delivery process through our digital platform.
                </Text>
              </View>
            </View>
          </TouchableOpacity>

           {/* Guest Role Card */}
           <TouchableOpacity 
            style={[
              styles.card,
              role === 'GUEST' && styles.selectedCard
            ]}
            onPress={() => handlePress('GUEST')}
          >
            <Animated.View style={[styles.blobBackground, blobStyle(agentBlobAnim)]} />
            <View style={[styles.cardContent, { backgroundColor: themeColors.background }]}>
            
              <View style={styles.textContainer}>
                <Text style={[styles.roleTitle, { color: themeColors.text }]}>
                  I am a Guest
                </Text>
                <Text style={[styles.roleDescription, { color: themeColors.text }]}>
                Sign up to explore our platform and get a feel for the service.
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <CustomButton buttonText="Continue" handlePress={handleContinueRegister} />
      </View>
    </ParallaxScrollView>
  );
};

export default ChooseRole;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: horizontalScale(20),
    marginTop: verticalScale(40),
  },
  title: {
    fontSize: moderateScale(32),
    lineHeight: moderateScale(44),
    fontWeight: 'bold',
    marginBottom: verticalScale(30),
  },
  cardsContainer: {
    width: '100%',
    marginBottom: verticalScale(30),
  },
  card: {
    width: '100%',
    marginBottom: verticalScale(20),
    borderRadius: moderateScale(16),
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: '#FFAC1C',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: moderateScale(16),
    zIndex: 1,
  },
  image: {
    width: horizontalScale(80),
    height: verticalScale(80),
    marginRight: horizontalScale(16),
  },
  textContainer: {
    flex: 1,
  },
  roleTitle: {
    fontSize: moderateScale(20),
    lineHeight: moderateScale(28),
    fontWeight: 'bold',
    marginBottom: verticalScale(4),
  },
  roleDescription: {
    fontSize: moderateScale(14),
    lineHeight: moderateScale(22),
    opacity: 0.8,
  },
  blobBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#FFAC1C',
    zIndex: 0,
  },
  reactLogo: {
    height: verticalScale(198),
    width: horizontalScale(290),
    bottom: moderateScale(0),
    left: moderateScale(50),
    position: 'absolute',
  },
});