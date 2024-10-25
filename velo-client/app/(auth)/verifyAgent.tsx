import { StyleSheet, TouchableOpacity, Animated } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import * as DocumentPicker from 'expo-document-picker';
import { ipURL } from '@/constants/backendUrl';
import Entypo from '@expo/vector-icons/Entypo';
import { moderateScale, verticalScale } from '@/constants/metrics';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';


const VerifyAgent = () => {
  const [doc1, setDoc1] = useState(null);
  const [docUrl, setDocUrl] = useState(null);
  const [userId, setUserId] = useState(null);
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial opacity
  const [uploadEligible, setUploadEligible] = useState(false); //Agent can only upload if registerVerificationStatus is PARTIAL 


  useEffect(() => {
    const getAccountDetail = async () => {
      let result = await SecureStore.getItemAsync('registerDetail');
      console.log(result, 'result--');
      setUserId(JSON.parse(result).id);

      if(JSON.parse(result).registerVerificationStatus === 'PARTIAL'){
        setUploadEligible(true);
      }

    }
    getAccountDetail();
  }, []);


  useEffect(() => {
    // Trigger animation when docUrl changes
    if (docUrl) {
      Animated.timing(fadeAnim, {
        toValue: 1, // Fully opaque
        duration: 500, // Animation duration
        useNativeDriver: true, // Use native driver for better performance
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 1, // Fade out when no document URL
        duration: 100, // Animation duration
        useNativeDriver: true, // Use native driver for better performance
      }).start();
    }
  }, [docUrl]); // Run effect when docUrl changes

  const postDocuments = async (document) => {
    
    const url = `${ipURL}/api/s3/upload-to-aws`;
    const formData = new FormData();

    if (document) {
      console.log(document, 'document--');

      // Append the file to the formData
      formData.append('document1', {
        uri: document.uri, // Use the URI directly
        name: document.name,
        type: document.type,
      });
    }

    formData.append('id', userId);  // Add any additional form data

    const options = {
      method: 'POST',
      body: formData,
      headers: {
        Accept: 'application/json', // Do NOT set 'Content-Type'
      },
    };

    try {
      const response = await fetch(url, options);
      const responseData = await response.json();
      console.log(responseData, 'responseData--');
      
      return responseData.data; // Return the data received from the server
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const pickDocument = async () => {

    let result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf", 
        copyToCacheDirectory: false,
    });

    if (!result.canceled) {
        let { name, size, uri } = result["assets"][0];
        let fileType = name.split('.').pop();

        // Check if the size is less than or equal to 3 MB
        const MAX_SIZE = 3 * 1024 * 1024; // 3 MB in bytes
        if (size > MAX_SIZE) {
            alert("The selected document exceeds the maximum size of 3 MB.");
            return; // Exit the function if the file is too large
        }

        const selectedDocument = {
            name: name,
            size: size,
            uri: uri,
            type: "application/" + fileType
        };

        setDoc1(selectedDocument);
        
        // Call postDocuments with the selected document
        const uploadedDocURL = await postDocuments(selectedDocument);
        setDocUrl(uploadedDocURL);
    } else {
        setDocUrl(null);
    }
};

console.log(docUrl, 'docUrl--');




  return (
    <ThemedView style={styles.container}>
      <ThemedText type='title'>Verification Process</ThemedText>
      {docUrl &&(<>
        <ThemedText type='default'>Document has been uploaded</ThemedText>
      <ThemedText type='mini'>We will verify and get back to you.</ThemedText>
      </>)}

      {!docUrl &&(<>
        <ThemedText type='default'>Upload document for verification</ThemedText>
      <ThemedText type='mini'>National Identification or Passport eligible</ThemedText>
      </>)}

     

     {uploadEligible ? <TouchableOpacity onPress={pickDocument}>
        <ThemedView style={[styles.uploadButtonContainer, docUrl && styles.uploadButtonComplete]}>
          <Animated.View style={{ opacity: fadeAnim }}>
            <ThemedText style={styles.uploadButtonText}>
              {docUrl ? (
                <>
                  <Entypo name="check" size={moderateScale(16)} color="white" style={styles.icon} />
                  Upload Complete
                </>
              ) : (
                <>
                  <Entypo name="upload" size={moderateScale(16)} color="white" style={styles.icon} />
                  Upload Document
                </>
              )}
            </ThemedText>
          </Animated.View>
        </ThemedView>
      </TouchableOpacity> : <ThemedText type='default'>You are not eligible to upload document. Contact Host</ThemedText>}

     {docUrl && <>
     
      <Animated.View style={[{ opacity: fadeAnim  },styles.submitButtonAnimateContainer]}>
     <TouchableOpacity onPress={()=>router.replace('/finalRegisterForm')} style={styles.submitButtonContainer}>
        <Entypo name="chevron-right" size={moderateScale(24)} color="black" />
      </TouchableOpacity>
      </Animated.View>
      </>
      }
    </ThemedView>
  );
};

export default VerifyAgent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'Montserrat'
  },
  uploadButtonContainer: {
    backgroundColor: '#FFAC1C',
    padding: moderateScale(10),
    borderRadius: moderateScale(5),
    marginTop: verticalScale(10)
  },
  uploadButtonComplete: {
    backgroundColor: '#4CAF50', 
  },
  uploadButtonText: {
    color: 'white',
  },
  icon: {
    marginRight: moderateScale(5),
  },
  submitButtonContainer: {
    backgroundColor: '#FFAC1C',
    padding: moderateScale(10),
    borderRadius: moderateScale(50),
  },
  submitButtonAnimateContainer: {
    position: 'absolute',
    right: moderateScale(20),
    bottom: verticalScale(40),
  }
});
