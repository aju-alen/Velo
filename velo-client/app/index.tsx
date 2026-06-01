import { StyleSheet, Text, Image, Animated, View, TouchableOpacity, ActivityIndicator } from 'react-native'
import { router } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useColorScheme } from '@/hooks/useColorScheme';
import { verticalScale, horizontalScale, moderateScale } from '@/constants/metrics';
import * as SecureStore from 'expo-secure-store';
import useLoginAccountStore from '@/store/loginAccountStore';
import { Colors } from '@/constants/Colors';

const RootIndex = () => {
  const { setAccountLoginData } = useLoginAccountStore()
  const scaleValue = useRef(new Animated.Value(1)).current;
  const colorScheme = useColorScheme();
  const theme = colorScheme ?? 'light';
  const textColor = theme === 'dark' ? Colors.dark.text : Colors.light.text;
  const [isChecking, setIsChecking] = useState(true);
  const [shouldShowLanding, setShouldShowLanding] = useState(false);

  const animateButton = useCallback(() => {
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 0.85,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      })
    ]).start(() => {
      router.push('/(auth)/chooseRole');
    });
  }, [scaleValue]);

  useEffect(() => {
    let isMounted = true;

    const checkUser = async () => {
      try {
        const user = await SecureStore.getItemAsync('registerDetail');

        if (!user) {
          if (isMounted) {
            setIsChecking(false);
            setShouldShowLanding(true);
          }
          return;
        }

        const userData = JSON.parse(user);
        setAccountLoginData(userData);

        const { registerVerificationStatus, role } = userData;

        // Incomplete registration -- send to finish the form
        if (registerVerificationStatus === 'PARTIAL') {
          router.replace('/(auth)/finalRegisterForm');
          return;
        }

        // Fully or partially verified users -- send to home
        const isVerifiedAgent =
          role === 'AGENT' &&
          (registerVerificationStatus === 'APPOINTMENT_BOOKED' || registerVerificationStatus === 'LOGGED_IN');
        const isVerifiedUser = role === 'USER' && registerVerificationStatus === 'LOGGED_IN';
        const isSuperAdmin = role === 'SUPERADMIN' && registerVerificationStatus === 'SUPERADMINLOGGEDIN';
        const isSubAgent = role === 'SUB_AGENT' && registerVerificationStatus === 'LOGGED_IN';

        if (isVerifiedAgent || isVerifiedUser || isSuperAdmin || isSubAgent) {
          router.replace('/(tabs)/home/homeMainPage');
          return;
        }

        // Unknown state -- fall through to landing page
        if (isMounted) {
          setIsChecking(false);
          setShouldShowLanding(true);
        }
      } catch (error) {
        // Malformed data in SecureStore -- clear it and show landing
        console.warn('Failed to read stored user data:', error);
        await SecureStore.deleteItemAsync('registerDetail');
        if (isMounted) {
          setIsChecking(false);
          setShouldShowLanding(true);
        }
      }
    };

    checkUser();

    return () => {
      isMounted = false;
    };
  }, []);

  // Show loading while checking user status
  if(isChecking){
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#FFAC1C" />
      </View>
    );
  }

  // Only show landing page if all checks failed (no navigation occurred)
  if(!shouldShowLanding){
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        {/* <Text style={styles.logoText}>Velo</Text> */}
        <Image
          source={require('@/assets/images/logo.png')}
          style={styles.logoImgContainer}
        />
        <Text style={[styles.heroText, styles.heroTextLogoText]}>Velo</Text>
      </View>
      <View>
        <Image
          source={require('@/assets/images/heroImage.jpg')}
          style={styles.heroImgContainer}
        />
      </View>

      <View style={styles.heroTextcontainer}>
        <Text style={[styles.heroText, { color: textColor }]}>
          Shipping made simple, anywhere. 
        </Text>
      </View>

      <View style={styles.heroTextcontainer}>
        <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
          <TouchableOpacity
            style={styles.customButton}
            onPress={animateButton}
          >
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
        </Animated.View>
        <Text style={[styles.defaultText, { color: textColor }]}>
          Already have an account? <Text style={styles.linkText} onPress={() => router.replace('/(auth)/login')}>Sign In</Text>
        </Text>
      </View>
    </View>
  );
}

export default RootIndex

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: verticalScale(40),
  },
  loadingContainer: {
    justifyContent: 'center',
  },
  logoContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: verticalScale(20),
    width: '100%',
  },
  logoImgContainer:{
    width:horizontalScale(100),
    height:verticalScale(60),
    marginTop: verticalScale(60),

  },
  heroImgContainer: {
    width: horizontalScale(300),
    height: verticalScale(300),
    borderRadius: moderateScale(20),
    marginTop: verticalScale(20),
  },
  heroTextcontainer: {
    marginTop: horizontalScale(20),
    width: '100%', // Set the container width to 100%
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: horizontalScale(20), // Optional: add padding for better spacing
  },
  heroText: {
    fontSize: moderateScale(25),
    fontWeight: 'bold',
    // textAlign: 'center', // Center the text within the container
  },
  heroTextLogoText: {
    color: '#FFAC1C',
    fontSize: moderateScale(30),
  },
  customButton: {
    backgroundColor: '#FFAC1C',
    paddingVertical: verticalScale(15),
    paddingHorizontal: horizontalScale(30),
    borderRadius: moderateScale(10),
    width: horizontalScale(250),
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: moderateScale(16),
    fontWeight: 'bold',
  },
  defaultText: {
    fontSize: moderateScale(16),
    marginTop: verticalScale(10),
  },
  linkText: {
    color: '#FFAC1C',
    textDecorationLine: 'underline',
  },
});