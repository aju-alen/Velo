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
  })

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

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        const listingData = {
          ...formData,
          listingPrice: parseFloat(formData.listingPrice),
          accountId: accountId,
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