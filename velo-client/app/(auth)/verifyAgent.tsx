import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';
import { ipURL } from '@/constants/backendUrl';
import CustomButton from '@/components/CustomButton';
import StartOverButton from '@/components/StartOverButton';
import { AuthScreen } from '@/components/forms/AuthScreen';
import { AppText } from '@/components/AppText';
import { useAppTheme } from '@/hooks/useAppTheme';
import { Spacing } from '@/constants/Colors';
import { AGENT_REG_STEPS } from '@/constants/flowSteps';

const VerifyAgent = () => {
  const { colors, radius } = useAppTheme();
  const [docUrl, setDocUrl] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadEligible, setUploadEligible] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  useEffect(() => {
    const getAccountDetail = async () => {
      const result = await SecureStore.getItemAsync('registerDetail');
      if (result) {
        const parsedResult = JSON.parse(result);
        setUserId(parsedResult.id);
        setUserName(parsedResult.name);
        setUploadEligible(parsedResult.registerVerificationStatus === 'PARTIAL');
        if (parsedResult.verificationDocumentUrl) {
          setDocUrl(parsedResult.verificationDocumentUrl);
        }
      }
    };
    getAccountDetail();
  }, []);

  const postDocuments = async (document: { uri: string; name: string; type: string }) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append('document1', {
      uri: document.uri,
      name: document.name,
      type: document.type,
    } as any);
    formData.append('id', userId || '');
    formData.append('name', userName || '');

    try {
      const response = await fetch(`${ipURL}/api/s3/upload-to-aws`, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' },
      });
      const responseData = await response.json();
      return responseData.data as string;
    } catch (error) {
      console.error('Error:', error);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: false,
      });
      if (result.canceled) return;

      const { name, size, uri } = result.assets[0];
      const fileType = name.split('.').pop();
      if ((size || 0) > 3 * 1024 * 1024) {
        alert('Maximum file size is 3 MB');
        return;
      }

      const selectedDocument = {
        name,
        uri,
        type: 'application/' + fileType,
      };
      setFileName(name);
      const uploadedDocURL = await postDocuments(selectedDocument);
      if (!uploadedDocURL) return;
      setDocUrl(uploadedDocURL);
      const stored = await SecureStore.getItemAsync('registerDetail');
      if (stored) {
        const parsed = JSON.parse(stored);
        await SecureStore.setItemAsync(
          'registerDetail',
          JSON.stringify({ ...parsed, verificationDocumentUrl: uploadedDocURL })
        );
      }
    } catch (error) {
      console.error('Error picking document:', error);
    }
  };

  return (
    <AuthScreen
      title="Verify your identity"
      subtitle="Upload a clear PDF of your national ID or passport. Max 3 MB."
      step={3}
      total={AGENT_REG_STEPS.length}
      stepLabel={AGENT_REG_STEPS[2].label}
      footer={
        <>
          {docUrl ? (
            <CustomButton
              buttonText="Continue"
              handlePress={() => router.replace('/(auth)/finalRegisterForm')}
            />
          ) : uploadEligible ? (
            <CustomButton
              buttonText={isUploading ? 'Uploading…' : 'Upload PDF'}
              handlePress={pickDocument}
              disableButton={isUploading}
            />
          ) : (
            <AppText variant="bodySmall" color={colors.danger}>
              Uploads are only available during registration. Contact support if you need help.
            </AppText>
          )}
          <StartOverButton />
        </>
      }
    >
      <View
        style={[
          styles.panel,
          { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.md },
        ]}
      >
        <AppText variant="label">Requirements</AppText>
        <AppText variant="body" secondary>
          National ID or passport only. PDF format. Clear, legible scan.
        </AppText>
      </View>

      {isUploading ? (
        <View style={styles.uploading}>
          <ActivityIndicator color={colors.tint} />
          <AppText variant="bodySmall" secondary>
            Uploading document…
          </AppText>
        </View>
      ) : null}

      {docUrl ? (
        <View
          style={[
            styles.panel,
            { backgroundColor: colors.surface, borderColor: colors.success, borderRadius: radius.md },
          ]}
        >
          <AppText variant="h3">Document uploaded</AppText>
          <AppText variant="bodySmall" secondary>
            {fileName || 'PDF ready for review'}
          </AppText>
        </View>
      ) : null}
    </AuthScreen>
  );
};

export default VerifyAgent;

const styles = StyleSheet.create({
  panel: {
    borderWidth: 1,
    padding: Spacing.xl,
    gap: Spacing.sm,
  },
  uploading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
});
