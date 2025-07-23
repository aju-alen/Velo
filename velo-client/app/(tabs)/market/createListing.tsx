import { StyleSheet, TextInput, TouchableOpacity, ScrollView, Platform, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard,RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ThemedView } from '@/components/ThemedView'
import { ThemedText } from '@/components/ThemedText'
import { verticalScale, horizontalScale, moderateScale } from '@/constants/metrics'
import axios from 'axios'
import { ipURL } from '@/constants/backendUrl'
import { useLocalSearchParams, router } from 'expo-router'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import CustomButton from '@/components/CustomButton'
import {Picker} from '@react-native-picker/picker';
import { useColorScheme } from '@/hooks/useColorScheme';
import axiosInstance from '@/constants/axiosHeader'
import * as ImagePicker from 'expo-image-picker'
import { Image, ActivityIndicator, View } from 'react-native'

const CreateListing = () => {
  const colorScheme = useColorScheme()
  
  const { accountId } = useLocalSearchParams()
  const [categoryData, setCategoryData] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)
  const [showConditionDropdown, setShowConditionDropdown] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    listingTitle: '',
    listingDescription: '',
    listingPrice: '',
    listingCategoryId: '',
    condition: '',
    imageUrl: '', // Add imageUrl to form data
  })

  // Image picker state
  const [image, setImage] = useState(null)
  const [uploading, setUploading] = useState(false)

  // Error state
  const [errors, setErrors] = useState({
    listingTitle: '',
    listingDescription: '',
    listingPrice: '',
    listingCategoryId: '',
    condition: '',
  })

  useEffect(() => {
    const getAllCategories = async () => {
      try {
        const categories = await axios.get(`${ipURL}/api/category/get-all-categories`)
        setCategoryData(categories.data)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching categories:', error)
        setLoading(false)
      }
    }
    getAllCategories()
  }, [])

  const validateForm = () => {
    let isValid = true
    const newErrors = {
        listingTitle: '',
        listingDescription: '',
      listingPrice: '',
      listingCategoryId: '',
      condition: '',
    }

    if (!formData.listingTitle.trim()) {
      newErrors.listingTitle = 'Title is required'
      isValid = false
    }

    if (!formData.listingDescription.trim()) {
      newErrors.listingDescription = 'Description is required'
      isValid = false
    }

    if (!formData.listingPrice.trim()) {
      newErrors.listingPrice = 'Price is required'
      isValid = false
    }

    if (!formData.listingCategoryId) {
      newErrors.listingCategoryId = 'Category is required'
      isValid = false
    }

    if (!formData.condition) {
      newErrors.condition = 'Condition is required'
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const pickImage = async () => {
    // Ask for permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!')
      return
    }
    // Pick image
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })
    if (!result.canceled) {
      setImage(result.assets[0].uri)
    }
  }

  const uploadImageToS3 = async () => {
    if (!image) return null
    setUploading(true)
    const uriParts = image.split('.')
    const fileType = uriParts[uriParts.length - 1]
    const formData: any = new FormData()
    formData.append('document1', {
      uri: image,
      name: `listing-image.${fileType}`,
      type: `image/${fileType}`,
    } as any)
    // You can add more fields if your backend expects them
    formData.append('id', String(accountId))
    formData.append('name', 'listing-image')
    try {
      const response = await fetch(`${ipURL}/api/s3/upload-to-aws`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      })
      const data = await response.json()
      console.log(data,"data of the image");
      
      setUploading(false)
      if (data.data) {
        return data.data // S3 URL
      } else {
        alert('Image upload failed')
        return null
      }
    } catch (error) {
      setUploading(false)
      alert('Image upload error')
      return null
    }
  }

  const handleSubmit = async () => {
    if (validateForm()) {
      let imageUrl = formData.imageUrl
      if (image && !imageUrl) {
        imageUrl = await uploadImageToS3()
        if (!imageUrl) return // Stop if upload failed
      }
      try {
        const listingData = {
          ...formData,
          listingPrice: parseFloat(formData.listingPrice),
          accountId: accountId,
          imageUrl,
        }
        console.log(listingData,'listingData');
        
        
        const response = await axiosInstance.post(`/api/listing/create-listing`, listingData)
        console.log(response.data,'response.data');
        
        if (response.data) {
          router.back()
        }
      } catch (error) {
        console.error('Error creating listing:', error)
      }
    }
  }

  return (
    <ThemedView style={styles.container}>
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    
    >
      <TouchableWithoutFeedback onPress={() => {
        Keyboard.dismiss()
        setShowCategoryDropdown(false)
        setShowConditionDropdown(false)
      }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <ThemedView style={styles.header}>
            <MaterialIcons 
              name="arrow-back" 
              size={24} 
              color="#666" 
              onPress={() => router.back()} 
            />
            <ThemedText style={styles.headerTitle}>Create Listing</ThemedText>
            <ThemedView style={{ width: 24 }} />
          </ThemedView>

          <ThemedView style={styles.formContainer}>
            {/* Title Input */}
            <ThemedView style={styles.inputContainer}>
              <ThemedText style={styles.label}>Title</ThemedText>
              <TextInput
                style={styles.input}
                placeholder="Enter listing title"
                value={formData.listingTitle}
                onChangeText={(text) => setFormData({ ...formData, listingTitle: text })}
              />
              {errors.listingTitle ? <ThemedText style={styles.errorText}>{errors.listingTitle}</ThemedText> : null}
            </ThemedView>

            {/* Description Input */}
            <ThemedView style={styles.inputContainer}>
              <ThemedText style={styles.label}>Description</ThemedText>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Enter listing description"
                value={formData.listingDescription}
                onChangeText={(text) => setFormData({ ...formData, listingDescription: text })}
                multiline
                numberOfLines={4}
              />
              {errors.listingDescription ? <ThemedText style={styles.errorText}>{errors.listingDescription}</ThemedText> : null}
            </ThemedView>

            {/* Price Input */}
            <ThemedView style={styles.inputContainer}>
              <ThemedText style={styles.label}>Price</ThemedText>
              <TextInput
                style={styles.input}
                placeholder="Enter price"
                value={formData.listingPrice}
                onChangeText={(text) => setFormData({ ...formData, listingPrice: text })}
                keyboardType="numeric"
              />
              {errors.listingPrice ? <ThemedText style={styles.errorText}>{errors.listingPrice}</ThemedText> : null}
            </ThemedView>

            {/* Image Picker */}
            <ThemedView style={styles.inputContainer}>
              <ThemedText style={styles.label}>Image</ThemedText>
              <TouchableOpacity onPress={pickImage} style={{ marginBottom: 10 }}>
                <ThemedText style={{ color: '#007AFF' }}>{image ? 'Change Image' : 'Pick an Image'}</ThemedText>
              </TouchableOpacity>
              {image && (
                <View style={{ alignItems: 'center', marginBottom: 10 }}>
                  <Image source={{ uri: image }} style={{ width: 120, height: 120, borderRadius: 8 }} />
                </View>
              )}
              {uploading && <ActivityIndicator size="small" color="#007AFF" />}
            </ThemedView>

            {/* Category Dropdown */}
            <ThemedView style={styles.inputContainer}>
              <ThemedText style={styles.label}>Category</ThemedText>

              <Picker
              style={styles.dropdown}
              mode='dialog'
  selectedValue={formData.listingCategoryId}
  onValueChange={(itemValue, itemIndex) =>
    setFormData({ ...formData, listingCategoryId: itemValue })

  }>
    <Picker.Item label="--Select category--" value="" color={ colorScheme === 'dark' ? 'white' : 'black' }/>
    {
        categoryData.map((category) => (
            <Picker.Item label={category.name} value={category.id} key={category.id} color='#666' />
        ))
    }
</Picker>
              
              {errors.listingCategoryId ? <ThemedText style={styles.errorText}>{errors.listingCategoryId}</ThemedText> : null}
            </ThemedView>

            {/* Condition Dropdown */}
            <ThemedView style={styles.inputContainer}>
              <ThemedText style={styles.label}>Condition</ThemedText>
             
                <Picker
                mode='dialog'
                style={styles.dropdown}
    selectedValue={formData.condition}
    onValueChange={(itemValue, itemIndex) =>
        setFormData({ ...formData, condition: itemValue })
    }>
    <Picker.Item label="--Select condition--" value="" color={ colorScheme === 'dark' ? 'white' : 'black' }/>
    <Picker.Item label="New" value="NEW" color='#666' />
    <Picker.Item label="Used" value="USED" color='#666' />
</Picker>

              {errors.condition ? <ThemedText style={styles.errorText}>{errors.condition}</ThemedText> : null}
            </ThemedView>

            <ThemedView style={styles.buttonContainer}>
              <CustomButton
                buttonText="Create Listing"
                buttonWidth={horizontalScale(300)}
                handlePress={handleSubmit}
              />
            </ThemedView>
          </ThemedView>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
    </ThemedView>
  )
}

export default CreateListing

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: verticalScale(60),
    paddingHorizontal: horizontalScale(20),
    marginBottom: verticalScale(20),
  },
  headerTitle: {
    fontSize: moderateScale(18),
    fontWeight: '600',
  },
  formContainer: {
    paddingHorizontal: horizontalScale(20),
  },
  inputContainer: {
    marginBottom: verticalScale(16),
  },
  label: {
    fontSize: moderateScale(14),
    marginBottom: verticalScale(8),
    fontWeight: '500',
  },
  input: {
    color: '#666',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: moderateScale(8),
    padding: moderateScale(12),
    fontSize: moderateScale(16),
  },
  textArea: {
    height: verticalScale(100),
    textAlignVertical: 'top',
  },
    dropdown: {
        color: '#666',
        borderRadius: moderateScale(8),
        fontSize: moderateScale(16),
    },
  dropdownText: {
    fontSize: moderateScale(16),
    color: 'gray',
  },
  dropdownList: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,

    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: moderateScale(8),
    marginTop: verticalScale(4),
    zIndex: 1000,
    elevation: 5,
  },
  dropdownItem: {
    padding: moderateScale(12),
    borderBottomWidth: 1,

  },
  errorText: {
    color: 'red',
    fontSize: moderateScale(12),
    marginTop: verticalScale(4),
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: verticalScale(20),
    marginBottom: verticalScale(40),
  },
})