import { StyleSheet, TextInput, TouchableOpacity, ScrollView, Platform, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, RefreshControl, Text, View, SafeAreaView, useColorScheme } from 'react-native'
import React, { useEffect, useState } from 'react'
import { verticalScale, horizontalScale, moderateScale } from '@/constants/metrics'
import axios from 'axios'
import { ipURL } from '@/constants/backendUrl'
import { useLocalSearchParams, router } from 'expo-router'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import CustomButton from '@/components/CustomButton'
import {Picker} from '@react-native-picker/picker';
import { Colors } from '@/constants/Colors'
import axiosInstance from '@/constants/axiosHeader'
import * as ImagePicker from 'expo-image-picker'
import * as ImageManipulator from 'expo-image-manipulator'
import { Image, ActivityIndicator } from 'react-native'

const CreateListing = () => {
  const colorScheme = useColorScheme() ?? 'light'
  const themeColors = Colors[colorScheme]
  
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
      quality: 0.8, // Reduced from 1.0 for initial selection
    })
    if (!result.canceled) {
      try {
        // Compress and resize the image
        const manipulatedImage = await ImageManipulator.manipulateAsync(
          result.assets[0].uri,
          [
            { resize: { width: 1200 } }, // Resize to max width of 1200px (maintains aspect ratio)
          ],
          { 
            compress: 0.6, // Compress to 60% quality (good balance between size and quality)
            format: ImageManipulator.SaveFormat.JPEG // Use JPEG for better compression
          }
        )
        setImage(manipulatedImage.uri)
      } catch (error) {
        console.error('Error compressing image:', error)
        // Fallback to original image if compression fails
        setImage(result.assets[0].uri)
      }
    }
  }

  const uploadImageToS3 = async () => {
    if (!image) return null
    setUploading(true)
    const uriParts = image.split('.')
    const fileType = uriParts[uriParts.length - 1]
    const formData: any = new FormData()
    const randomNumber = Math.floor(100000 + Math.random() * 900000)
    formData.append('document1', {
      uri: image,
      name: `listing-image-${randomNumber}.${fileType}`,
      type: `image/${fileType}`,
    } as any)
    // You can add more fields if your backend expects them
    formData.append('id', String(accountId))
    formData.append('name', '')
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
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={() => {
          Keyboard.dismiss()
          setShowCategoryDropdown(false)
          setShowConditionDropdown(false)
        }}>
          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.header}>
              <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
                <MaterialIcons 
                  name="arrow-back" 
                  size={24} 
                  color={themeColors.icon} 
                />
              </TouchableOpacity>
              <Text style={[styles.headerTitle, { color: themeColors.text }]}>Create Listing</Text>
              <View style={{ width: 24 }} />
            </View>

            <View style={styles.formContainer}>
              {/* Title Input */}
              <View style={styles.inputContainer}>
                <Text style={[styles.label, { color: themeColors.text }]}>Title</Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                      borderColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                      color: themeColors.text,
                    }
                  ]}
                  placeholder="Enter listing title"
                  placeholderTextColor={colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)'}
                  value={formData.listingTitle}
                  onChangeText={(text) => setFormData({ ...formData, listingTitle: text })}
                />
                {errors.listingTitle ? <Text style={styles.errorText}>{errors.listingTitle}</Text> : null}
              </View>

              {/* Description Input */}
              <View style={styles.inputContainer}>
                <Text style={[styles.label, { color: themeColors.text }]}>Description</Text>
                <TextInput
                  style={[
                    styles.input,
                    styles.textArea,
                    {
                      backgroundColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                      borderColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                      color: themeColors.text,
                    }
                  ]}
                  placeholder="Enter listing description"
                  placeholderTextColor={colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)'}
                  value={formData.listingDescription}
                  onChangeText={(text) => setFormData({ ...formData, listingDescription: text })}
                  multiline
                  numberOfLines={4}
                />
                {errors.listingDescription ? <Text style={styles.errorText}>{errors.listingDescription}</Text> : null}
              </View>

              {/* Price Input */}
              <View style={styles.inputContainer}>
                <Text style={[styles.label, { color: themeColors.text }]}>Price</Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                      borderColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                      color: themeColors.text,
                    }
                  ]}
                  placeholder="Enter price"
                  placeholderTextColor={colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)'}
                  value={formData.listingPrice}
                  onChangeText={(text) => setFormData({ ...formData, listingPrice: text })}
                  keyboardType="numeric"
                />
                {errors.listingPrice ? <Text style={styles.errorText}>{errors.listingPrice}</Text> : null}
              </View>

              {/* Image Picker */}
              <View style={styles.inputContainer}>
                <Text style={[styles.label, { color: themeColors.text }]}>Image</Text>
                <TouchableOpacity 
                  onPress={pickImage} 
                  style={[
                    styles.imagePickerButton,
                    {
                      backgroundColor: colorScheme === 'dark' ? 'rgba(255, 172, 28, 0.1)' : 'rgba(255, 172, 28, 0.1)',
                      borderColor: '#FFAC1C',
                    }
                  ]}
                  activeOpacity={0.7}
                >
                  <MaterialIcons 
                    name={image ? 'edit' : 'add-photo-alternate'} 
                    size={20} 
                    color="#FFAC1C" 
                    style={{ marginRight: horizontalScale(8) }}
                  />
                  <Text style={[styles.imagePickerText, { color: '#FFAC1C' }]}>
                    {image ? 'Change Image' : 'Pick an Image'}
                  </Text>
                </TouchableOpacity>
                {image && (
                  <View style={styles.imagePreviewContainer}>
                    <Image 
                      source={{ uri: image }} 
                      style={styles.imagePreview}
                    />
                  </View>
                )}
                {uploading && (
                  <View style={styles.uploadingContainer}>
                    <ActivityIndicator size="small" color="#FFAC1C" />
                    <Text style={[styles.uploadingText, { color: themeColors.text }]}>Uploading...</Text>
                  </View>
                )}
              </View>

              {/* Category Dropdown */}
              <View style={styles.inputContainer}>
                <Text style={[styles.label, { color: themeColors.text }]}>Category</Text>
                <View style={[
                  styles.pickerContainer,
                  {
                    backgroundColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                    borderColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                  }
                ]}>
                  <Picker
                    style={[
                      styles.dropdown,
                      { color: themeColors.text }
                    ]}
                    mode='dialog'
                    selectedValue={formData.listingCategoryId}
                    onValueChange={(itemValue, itemIndex) =>
                      setFormData({ ...formData, listingCategoryId: itemValue })
                    }
                  >
                    <Picker.Item label="--Select category--" value="" color={colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)'} />
                    {
                      categoryData.map((category) => (
                        <Picker.Item 
                          label={category.name} 
                          value={category.id} 
                          key={category.id} 
                          color={themeColors.text}
                        />
                      ))
                    }
                  </Picker>
                </View>
                {errors.listingCategoryId ? <Text style={styles.errorText}>{errors.listingCategoryId}</Text> : null}
              </View>

              {/* Condition Dropdown */}
              <View style={styles.inputContainer}>
                <Text style={[styles.label, { color: themeColors.text }]}>Condition</Text>
                <View style={[
                  styles.pickerContainer,
                  {
                    backgroundColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                    borderColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                  }
                ]}>
                  <Picker
                    mode='dialog'
                    style={[
                      styles.dropdown,
                      { color: themeColors.text }
                    ]}
                    selectedValue={formData.condition}
                    onValueChange={(itemValue, itemIndex) =>
                      setFormData({ ...formData, condition: itemValue })
                    }
                  >
                    <Picker.Item label="--Select condition--" value="" color={colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)'} />
                    <Picker.Item label="New" value="NEW" color={themeColors.text} />
                    <Picker.Item label="Used" value="USED" color={themeColors.text} />
                  </Picker>
                </View>
                {errors.condition ? <Text style={styles.errorText}>{errors.condition}</Text> : null}
              </View>

              <View style={styles.buttonContainer}>
                <CustomButton
                  buttonText="Create Listing"
                  buttonWidth={horizontalScale(300)}
                  handlePress={handleSubmit}
                />
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default CreateListing

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: horizontalScale(20),
    paddingTop: verticalScale(20),
    paddingBottom: verticalScale(40),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: verticalScale(20),
    marginBottom: verticalScale(10),
  },
  headerTitle: {
    fontSize: moderateScale(20),
    fontWeight: '600',
  },
  formContainer: {
    gap: verticalScale(20),
  },
  inputContainer: {
    marginBottom: verticalScale(4),
  },
  label: {
    fontSize: moderateScale(14),
    marginBottom: verticalScale(8),
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderRadius: moderateScale(12),
    paddingHorizontal: horizontalScale(16),
    paddingVertical: verticalScale(14),
    fontSize: moderateScale(16),
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  textArea: {
    height: verticalScale(120),
    textAlignVertical: 'top',
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: moderateScale(12),
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  dropdown: {
    fontSize: moderateScale(16),
  },
  imagePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: moderateScale(12),
    paddingVertical: verticalScale(14),
    paddingHorizontal: horizontalScale(16),
    marginBottom: verticalScale(12),
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  imagePickerText: {
    fontSize: moderateScale(16),
    fontWeight: '500',
  },
  imagePreviewContainer: {
    alignItems: 'center',
    marginTop: verticalScale(8),
    marginBottom: verticalScale(8),
  },
  imagePreview: {
    width: horizontalScale(200),
    height: verticalScale(200),
    borderRadius: moderateScale(12),
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  uploadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: verticalScale(8),
    gap: horizontalScale(8),
  },
  uploadingText: {
    fontSize: moderateScale(14),
    fontStyle: 'italic',
  },
  errorText: {
    color: '#F44336',
    fontSize: moderateScale(12),
    marginTop: verticalScale(6),
    marginLeft: horizontalScale(4),
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: verticalScale(30),
    marginBottom: verticalScale(20),
  },
})