import React,{useState,useRef} from 'react'
import { StyleSheet, Text, View,Image,Animated,Easing } from 'react-native'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { TouchableOpacity } from 'react-native'
import ParallaxScrollView from '@/components/ParallaxScrollView'
import CustomButton from '@/components/CustomButton'
import { verticalScale,horizontalScale,moderateScale } from '@/constants/metrics'
import { router } from 'expo-router'

const chooseRole = () => {
    const [role, setRole] = useState('USER');
    const userBlobAnim = useRef(new Animated.Value(1)).current;
  const agentBlobAnim = useRef(new Animated.Value(0)).current;

  const handleContinueRegister = () => {
    // role === 'user' ? router.push('/userRegister') : router.push('/agentRegister');
    router.replace({ pathname: "/register", params: { role } });
  }

    const handlePress = (selectedRole) => {
      console.log(selectedRole,'selectedRole--');
      
      setRole(selectedRole);
  
      if (selectedRole === 'USER') {
        // Animate the blob for 'user'
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
        // Animate the blob for 'agent'
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
    <ThemedView style={styles.container}>
    <ThemedText type="title" style={styles.title}>Choose Role</ThemedText>

    <ThemedView style={styles.imageContainer}>
      {/* First Box: User Role */}
      <ThemedView style={styles.box}>
        <TouchableOpacity onPress={() => handlePress('USER')}>
          {/* Blob Background for User */}
          <Animated.View style={[styles.blobBackground, blobStyle(userBlobAnim)]} />
          <Image
            source={require('@/assets/images/UserRole.png')}
            style={styles.image}
          />
          <ThemedText type="subtitle" style={styles.imageText}>
            I am a user
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>

      {/* Second Box: Agent Role */}
      <ThemedView style={styles.box}>
        <TouchableOpacity onPress={() => handlePress('AGENT')}>
          {/* Blob Background for Agent */}
          <Animated.View style={[styles.blobBackground, blobStyle(agentBlobAnim)]} />
          <Image
            source={require('@/assets/images/AgentRole.png')}
            style={styles.image}
          />
          <ThemedText type="subtitle" style={styles.imageText}>
            I am an agent
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>

    <CustomButton buttonText="Continue" handlePress={handleContinueRegister} />
  </ThemedView>

  </ParallaxScrollView>

  )
}

export default chooseRole

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: verticalScale(40),
      },
      title: {
        marginBottom: verticalScale(30),
        fontWeight: 'bold',
      },
      imageContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        height: verticalScale(300),
      },
      box: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: horizontalScale(10),
        position: 'relative',
      },
      image: {
        width: horizontalScale(150),
        height: verticalScale(150),
        marginBottom: verticalScale(10),
        zIndex: 1, // Ensure the image is on top
      },
      imageText: {
        fontWeight: '500',
        textAlign: 'center',
        zIndex: 1, // Ensure the text is on top
      },
      blobBackground: {
        position: 'absolute',
        width: horizontalScale(160),
        height: verticalScale(200),
        backgroundColor: '#FFAC1C',
        borderRadius: moderateScale(10), // Circular blob shape
        zIndex: 0,
        opacity: 0.6, // Semi-transparent blob
      },
  
      reactLogo: {
        height: verticalScale(198),
        width: horizontalScale(290),
        bottom: moderateScale(0),
        left: moderateScale(50),
        position: 'absolute',
      },
})