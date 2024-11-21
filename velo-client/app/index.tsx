import { StyleSheet, Text, Image,Animated } from 'react-native'
import { router } from "expo-router";
import React,{useEffect, useRef} from 'react'
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import CustomButton from '@/components/CustomButton';
import { useColorScheme } from '@/hooks/useColorScheme';
import { verticalScale,horizontalScale,moderateScale } from '@/constants/metrics';
import * as SecureStore from 'expo-secure-store';
import useLoginAccountStore from '@/store/loginAccountStore';

const RootIndex = () => {
  const {setAccountLoginData} = useLoginAccountStore()
  const scaleValue = useRef(new Animated.Value(1)).current; // Initialize scale value
  const colorScheme = useColorScheme();

  const animateButton = () => {
    // Scale the button down
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 0.85,  // Scale down to 95%
        duration: 300,  // Animation duration
        useNativeDriver: true,
      }),
      // Scale back to normal size
      Animated.timing(scaleValue, {
        toValue: 1,     // Scale back to 100%
        duration: 100,
        useNativeDriver: true,
      })
    ]).start(() => {
      // Once animation is done, navigate to the next screen
      router.push('/(auth)/chooseRole'); // Replace 'NextScreen' with your stack route
    });
  };

  useEffect(() => {
    const checkUser = async () => {
      let user = await SecureStore.getItemAsync('registerDetail')
      setAccountLoginData(JSON.parse(user))
      
      if(!user){
        return
      }
      const userData = JSON.parse(user)
      console.log(userData, 'userData------');
      
      if(userData.registerVerificationStatus === 'PARTIAL' && userData.role === 'AGENT'){
        router.push('/(auth)/finalRegisterForm')
      }
      else if(userData.registerVerificationStatus === 'PARTIAL' && userData.role === 'USER'){
        router.replace('/(auth)/finalRegisterForm')
      }
      else if(userData.registerVerificationStatus === 'APPOINTMENT_BOOKED' && userData.role === 'AGENT'){
        router.replace('/(tabs)/home')
      }
      else if(userData.registerVerificationStatus === 'LOGGED_IN' && userData.role === 'USER'){
        router.replace('/(tabs)/home/createShipment/payment')
      }
      
     

      
    }

    checkUser();
  }, []);

  

  return (
    
      <ThemedView  style={styles.container}   >
        <ThemedView style={styles.logoContainer}>
{/* <ThemedText type='logoText' style={styles.logoText}>Velo</ThemedText> */}
<Image
            source={require('@/assets/images/logo.png')}
            style={styles.logoImgContainer}
          />
          <ThemedText type='subtitle' style={[styles.heroText, styles.heroTextLogoText]}>Velo</ThemedText>
</ThemedView>
        <ThemedView>
          <Image
            source={require('@/assets/images/heroImage.jpg')}
            style={styles.heroImgContainer}
          />
        </ThemedView>

        <ThemedView style={styles.heroTextcontainer}>
          <ThemedText type='subtitle' style={styles.heroText}>
            Shipping made simple, anywhere. 
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.heroTextcontainer}>
        <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
          <CustomButton
            buttonText='Get Started'
            handlePress={animateButton}
            buttonWidth={horizontalScale(250)}
          />
          </Animated.View>
          <ThemedText type='default'>
            Already have an account? <ThemedText type='link' style={{ color: '#FFAC1C' }} onPress={() => router.replace('/(auth)/login')}>Sign In</ThemedText>
          </ThemedText>
        </ThemedView>
      </ThemedView>
    
  );
}

export default RootIndex

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: verticalScale(40),
  },
  logoText: {
    marginTop: verticalScale(60),
  },
  logoContainer:{
    display:"flex",
    flexDirection:"column",
    justifyContent:"center",
    alignItems:"center",
    paddingBottom:verticalScale(20),
    width:"100%"
    
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
  buttonContainer: {
    marginTop: verticalScale(20),
    backgroundColor: '#FFAC1C',
    padding: moderateScale(10),
    borderRadius: moderateScale(10),
    width: horizontalScale(300),
  },
});
