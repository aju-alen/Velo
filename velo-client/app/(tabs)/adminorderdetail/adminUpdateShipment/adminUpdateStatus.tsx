import { StyleSheet, TouchableOpacity, Image, View, ScrollView, KeyboardAvoidingView, Platform } from 'react-native'
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import React, { useState, useRef, useEffect } from 'react'
import { ThemedView } from '@/components/ThemedView'
import { ThemedText } from '@/components/ThemedText'
import * as ImageManipulator from 'expo-image-manipulator';
import { ipURL } from '@/constants/backendUrl';
import useShipmentStore from '@/store/shipmentStore';
import useLoginAccountStore from '@/store/loginAccountStore';
import axiosInstance from '@/constants/axiosHeader';
import { Picker } from '@react-native-picker/picker';
import { router } from 'expo-router';
import { useColorScheme } from '@/hooks/useColorScheme';

// Enum to match Prisma model
enum ShipmentStatus {
  SHIPMENT_PICKED = 'SHIPMENT_PICKED',
  SHIPMENT_DROPPED = 'SHIPMENT_DROPPED',
  IN_TRANSIT_START = 'IN_TRANSIT_START',
  IN_TRANSIT_END = 'IN_TRANSIT_END',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  DELIVERED = 'DELIVERED'
}

const AdminUpdateStatus = () => {
  const { agentShipmentData } = useShipmentStore();
  const { accountLoginData } = useLoginAccountStore();
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState<string | null>(null);
  const [isPreview, setIsPreview] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<ShipmentStatus>();
  const cameraRef = useRef<any>(null);

  const colorScheme = useColorScheme();
  const pickerBg = colorScheme === 'dark' ? '#23242A' : '#FFF';
  const pickerBorder = colorScheme === 'dark' ? '#333' : '#E0E0E0';
  const pickerText = colorScheme === 'dark' ? '#FFF' : '#222';

  // Status options with human-readable labels
  const statusOptions = [
    { label: 'Shipment Picked', value: ShipmentStatus.SHIPMENT_PICKED },
    { label: 'Shipment Dropped', value: ShipmentStatus.SHIPMENT_DROPPED },
    { label: 'In Transit', value: ShipmentStatus.IN_TRANSIT_START },
    { label: 'In Final Hub', value: ShipmentStatus.IN_TRANSIT_END },
    { label: 'Out for Delivery', value: ShipmentStatus.OUT_FOR_DELIVERY },
    { label: 'Delivered', value: ShipmentStatus.DELIVERED }
  ];

  // Set initial status based on current shipment status when component mounts
  useEffect(() => {
    if (agentShipmentData?.shipmentStatus) {
      setSelectedStatus(agentShipmentData.shipmentStatus as ShipmentStatus);
    }
  }, [agentShipmentData]);

  const postImage = async (imageFile: any, approvalStatus: string) => {
    setIsUploading(true);

    const url = `${ipURL}/api/s3/upload-to-aws-update-shipment`;
    const formData = new FormData();

    if (imageFile) {
      formData.append('image1', {
        uri: imageFile.uri,
        name: imageFile.name,
        type: imageFile.type,
      });
    }

    try {
      formData.append('shipmentStatus', selectedStatus);
      formData.append('shipmentId', agentShipmentData.shipmentId);
      formData.append('AgentStatus', approvalStatus);
      
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
          "authorization": `Bearer ${accountLoginData.token}`,
        },
      });
      const responseData = await response.json();
      setIsUploading(false);
      return responseData.data;
    } catch (error) {
      setIsUploading(false);
      console.error('Error:', error);
      return null;
    }
  };

  const updateShipmentStatus = async (imageUrl: string, approvalStatus: string, selectedStatus:string ) => {
    try {
      const updateData = await axiosInstance.put(
        `/api/shipment/agent-update-shipment-status-picked-up/${agentShipmentData.shipmentId}`,
        {
          imageUrl,
          status: approvalStatus,
          shipmentStatus: selectedStatus
        }
      );
      console.log(updateData.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCapture = async () => {
    if (!cameraRef.current) return;
    
    try {
      const photo = await cameraRef.current.takePictureAsync();
      
      const manipulatedImage = await ImageManipulator.manipulateAsync(
        photo.uri,
        [{ resize: { width: 1080 } }],
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
      );
      
      setPhoto(manipulatedImage.uri);
      setIsPreview(true);
    } catch (error) {
      console.error('Failed to take picture:', error);
    }
  };

  const handleRetake = () => {
    setPhoto(null);
    setImageUrl(null);
    setIsPreview(false);
  };

  const handleApprove = async (approvalStatus: string) => {
    if (!photo) {
      console.log('No photo taken');
      return;
    }

    const imageFile = {
      uri: photo,
      name: `image_${Date.now()}.jpg`,
      type: 'image/jpeg',
    };

    try {
      const uploadedImageURL = await postImage(imageFile, approvalStatus);
      if (uploadedImageURL) {
        setImageUrl(uploadedImageURL);
        console.log('Image uploaded successfully:', uploadedImageURL);
        await updateShipmentStatus(uploadedImageURL, approvalStatus,selectedStatus);
        router.replace('/(tabs)/home/homeMainPage')
      } else {
        console.log('Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  if (!permission) {
    return <ThemedView />;
  }

  if (!permission.granted) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={styles.message}>We need your permission to show the camera</ThemedText>
        <TouchableOpacity onPress={requestPermission} >
          <ThemedText style={styles.message}>Grant Permission</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, padding: 20 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <ThemedText style={styles.title}>Update Status</ThemedText>
        
        <ThemedView
          style={{
            backgroundColor: pickerBg,
            borderColor: pickerBorder,
            borderWidth: 1,
            borderRadius: 10,
            minHeight: 48,
            marginVertical: 12,
            justifyContent: 'center',
            width: '100%',
          }}
        >
          <Picker
            selectedValue={selectedStatus}
            onValueChange={(itemValue) => setSelectedStatus(itemValue as ShipmentStatus)}
            style={{ color: pickerText, width: '100%' }}
            dropdownIconColor={pickerText}
          >
            {statusOptions.map((option) => (
              <Picker.Item
                key={option.value}
                label={option.label}
                value={option.value}
                color={pickerText}
              />
            ))}
          </Picker>
        </ThemedView>

        <ThemedView style={styles.cameraContainer}>
          {isPreview && photo ? (
            <View style={styles.previewContainer}>
              <Image source={{ uri: photo }} style={styles.preview} />
              <TouchableOpacity style={styles.retakeButton} onPress={handleRetake}>
                <ThemedText style={styles.buttonText}>Retake</ThemedText>
              </TouchableOpacity>
              {imageUrl && (
                <View style={styles.uploadSuccess}>
                  <ThemedText style={styles.successText}>Upload Successful!</ThemedText>
                </View>
              )}
            </View>
          ) : (
            <CameraView 
              ref={cameraRef}
              style={styles.camera} 
              facing={facing}
            >
              <ThemedView style={styles.cameraControls}>
                <TouchableOpacity style={styles.captureButton} onPress={handleCapture}>
                  <View style={styles.captureButtonInner} />
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.flipButton} onPress={toggleCameraFacing}>
                  <ThemedText style={styles.text}>Flip</ThemedText>
                </TouchableOpacity>
              </ThemedView>
            </CameraView>
          )}
        </ThemedView>
        
        <ThemedView style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[
              styles.button, 
              styles.approveButton, 
              (!photo || isUploading) && styles.disabledButton
            ]} 
            onPress={() => handleApprove('APPROVED')}
            disabled={!photo || isUploading}
          >
            <ThemedText style={styles.buttonText}>
              {isUploading ? 'Uploading...' : 'Approve'}
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.rejectButton]} 
            onPress={() => handleApprove('REJECTED')}
            disabled={isUploading}
          >
            <ThemedText style={styles.buttonText}>Reject</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AdminUpdateStatus;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  pickerContainer: {
    width: '100%',
    marginBottom: 20,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
    overflow: 'hidden',
  },
  picker: {
    width: '100%',
    height: 50,
  },
  cameraContainer: {
    width: '100%',
    aspectRatio: 3/4,
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },
  camera: {
    flex: 1,
  },
  previewContainer: {
    flex: 1,
    position: 'relative',
  },
  preview: {
    flex: 1,
    width: '100%',
  },
  retakeButton: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 10,
    borderRadius: 10,
  },
  cameraControls: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingBottom: 20,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
  },
  flipButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 10,
    borderRadius: 10,
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  approveButton: {
    backgroundColor: '#4CAF50',
  },
  rejectButton: {
    backgroundColor: '#F44336',
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  uploadSuccess: {
    position: 'absolute',
    top: 20,
    alignSelf: 'center',
    backgroundColor: 'rgba(76, 175, 80, 0.9)',
    padding: 10,
    borderRadius: 10,
  },
  successText: {
    color: 'white',
    fontWeight: 'bold',
  },
});