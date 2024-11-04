import { StyleSheet, TouchableOpacity, Animated, View,ActivityIndicator } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { ThemedView } from '@/components/ThemedView'
import { ThemedText } from '@/components/ThemedText'
import * as DocumentPicker from 'expo-document-picker'
import { ipURL } from '@/constants/backendUrl'
import { Entypo, MaterialCommunityIcons } from '@expo/vector-icons'
import { moderateScale, verticalScale, horizontalScale } from '@/constants/metrics'
import * as SecureStore from 'expo-secure-store'
import { router } from 'expo-router'

const VerifyAgent = () => {
  const [doc1, setDoc1] = useState(null)
  const [docUrl, setDocUrl] = useState(null)
  const [userId, setUserId] = useState(null)
  const [userName, setUserName] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadEligible, setUploadEligible] = useState(false)
  
  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current
  const scaleAnim = useRef(new Animated.Value(0.95)).current
  const progressAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    const getAccountDetail = async () => {
      const result = await SecureStore.getItemAsync('registerDetail')
      if (result) {
        const parsedResult = JSON.parse(result)
        setUserId(parsedResult.id)
        setUserName(parsedResult.name)
        setUploadEligible(parsedResult.registerVerificationStatus === 'PARTIAL')
      }
    }
    getAccountDetail()
  }, [])

  useEffect(() => {
    if (docUrl) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        })
      ]).start()
    }
  }, [docUrl])

  const animateProgress = () => {
    progressAnim.setValue(0)
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: false,
    }).start()
  }

  const postDocuments = async (document) => {
    setIsUploading(true)
    animateProgress()

    const url = `${ipURL}/api/s3/upload-to-aws`
    const formData = new FormData()

    if (document) {
      formData.append('document1', {
        uri: document.uri,
        name: document.name,
        type: document.type,
      })
    }

    formData.append('id', userId)
    formData.append('name', userName)

    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
        },
      })
      const responseData = await response.json()
      setIsUploading(false)
      return responseData.data
    } catch (error) {
      setIsUploading(false)
      console.error('Error:', error)
    }
  }

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        copyToCacheDirectory: false,
      })

      if (!result.canceled) {
        const { name, size, uri } = result.assets[0]
        const fileType = name.split('.').pop()
        const MAX_SIZE = 3 * 1024 * 1024 // 3 MB

        if (size > MAX_SIZE) {
          alert("Maximum file size is 3 MB")
          return
        }

        const selectedDocument = {
          name,
          size,
          uri,
          type: "application/" + fileType
        }

        setDoc1(selectedDocument)
        const uploadedDocURL = await postDocuments(selectedDocument)
        setDocUrl(uploadedDocURL)
      }
    } catch (error) {
      console.error('Error picking document:', error)
    }
  }

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%']
  })

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <MaterialCommunityIcons 
          name="upload" 
          size={moderateScale(48)} 
          color="#FFAC1C" 
        />
        <ThemedText type='title' style={styles.title}>
          Verification Process
        </ThemedText>
      </View>

      <View style={styles.content}>
        {docUrl ? (
          <View style={styles.successContainer}>
            <View style={styles.successIcon}>
              <Entypo name="check" size={moderateScale(24)} color="#4CAF50" />
            </View>
            <ThemedText type='default' style={styles.successText}>
              Document Successfully Uploaded
            </ThemedText>
            <ThemedText type='mini' style={styles.verifyText}>
              We'll verify your document and notify you soon
            </ThemedText>
          </View>
        ) : (
          <View style={styles.instructionsContainer}>
            <ThemedText type='default' style={styles.instructionTitle}>
              Document Requirements:
            </ThemedText>
            <View style={styles.requirementItem}>
              <Entypo name="dot-single" size={moderateScale(20)} color="#FFAC1C" />
              <ThemedText type='mini'>National ID or Passport only</ThemedText>
            </View>
            <View style={styles.requirementItem}>
              <Entypo name="dot-single" size={moderateScale(20)} color="#FFAC1C" />
              <ThemedText type='mini'>PDF format, max 3MB</ThemedText>
            </View>
            <View style={styles.requirementItem}>
              <Entypo name="dot-single" size={moderateScale(20)} color="#FFAC1C" />
              <ThemedText type='mini'>Clear and legible scan</ThemedText>
            </View>
          </View>
        )}

        {uploadEligible ? (
          <TouchableOpacity 
            onPress={pickDocument}
            disabled={isUploading}
            style={[
              styles.uploadButton,
              docUrl && styles.uploadComplete,
              isUploading && styles.uploading
            ]}
          >
            <Animated.View 
              style={[
                styles.buttonContent,
                { transform: [{ scale: scaleAnim }] }
              ]}
            >
              {isUploading ? (
                <>
                  <ActivityIndicator color="white" style={styles.uploadingIndicator} />
                  <ThemedText style={styles.uploadButtonText}>
                    Uploading...
                  </ThemedText>
                  <Animated.View 
                    style={[
                      styles.progressBar,
                      { width: progressWidth }
                    ]} 
                  />
                </>
              ) : (
                <ThemedText style={styles.uploadButtonText}>
                  {docUrl ? (
                    <>
                      <Entypo name="check" size={moderateScale(16)} color="white" />
                      {" "}Document Uploaded
                    </>
                  ) : (
                    <>
                      <Entypo name="upload" size={moderateScale(16)} color="white" />
                      {" "}Upload Document
                    </>
                  )}
                </ThemedText>
              )}
            </Animated.View>
          </TouchableOpacity>
        ) : (
          <View style={styles.notEligibleContainer}>
            <MaterialCommunityIcons name="alert-circle-outline" size={moderateScale(24)} color="#FF6B6B" />
            <ThemedText type='default' style={styles.notEligibleText}>
              Contact administrator for upload eligibility
            </ThemedText>
          </View>
        )}
      </View>

      {docUrl && (
        <Animated.View 
          style={[
            styles.nextButtonContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }]
            }
          ]}
        >
          <TouchableOpacity 
            onPress={() => router.replace('/finalRegisterForm')}
            style={styles.nextButton}
          >
            <ThemedText style={styles.nextButtonText}>Continue</ThemedText>
            <Entypo name="chevron-right" size={moderateScale(20)} color="white" />
          </TouchableOpacity>
        </Animated.View>
      )}
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: moderateScale(20),
  },
  header: {
    alignItems: 'center',
    marginTop: verticalScale(40),
    marginBottom: verticalScale(30),
  },
  title: {
    fontSize: moderateScale(24),
    marginTop: verticalScale(10),
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  instructionsContainer: {
    width: '100%',
    marginBottom: verticalScale(30),
    padding: moderateScale(20),
    borderRadius: moderateScale(12),
    backgroundColor: 'rgba(255, 172, 28, 0.1)',
  },
  instructionTitle: {
    marginBottom: verticalScale(10),
    fontSize: moderateScale(16),
    fontWeight: '600',
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(8),
  },
  successContainer: {
    alignItems: 'center',
    marginBottom: verticalScale(30),
  },
  successIcon: {
    width: moderateScale(50),
    height: moderateScale(50),
    borderRadius: moderateScale(25),
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: verticalScale(10),
  },
  successText: {
    fontSize: moderateScale(18),
    fontWeight: '600',
    marginBottom: verticalScale(5),
  },
  verifyText: {
    opacity: 0.7,
  },
  uploadButton: {
    width: '100%',
    backgroundColor: '#FFAC1C',
    borderRadius: moderateScale(12),
    overflow: 'hidden',
  },
  uploadComplete: {
    backgroundColor: '#4CAF50',
  },
  uploading: {
    backgroundColor: '#FFAC1C',
  },
  buttonContent: {
    padding: moderateScale(15),
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadButtonText: {
    color: 'white',
    fontSize: moderateScale(16),
    fontWeight: '600',
  },
  uploadingIndicator: {
    marginBottom: verticalScale(5),
  },
  progressBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: verticalScale(3),
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  notEligibleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    padding: moderateScale(15),
    borderRadius: moderateScale(12),
  },
  notEligibleText: {
    marginLeft: horizontalScale(10),
    color: '#FF6B6B',
  },
  nextButtonContainer: {
    position: 'absolute',
    bottom: verticalScale(40),
    right: horizontalScale(20),
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFAC1C',
    paddingHorizontal: horizontalScale(20),
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(25),
  },
  nextButtonText: {
    color: 'white',
    marginRight: horizontalScale(5),
    fontSize: moderateScale(16),
    fontWeight: '600',
  },
})

export default VerifyAgent