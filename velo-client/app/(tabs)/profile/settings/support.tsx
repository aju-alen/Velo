import React from 'react';
import { StyleSheet, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useColorScheme } from '@/hooks/useColorScheme';

const Support = () => {
  const colorScheme = useColorScheme();
  const bgCard = colorScheme === 'dark' ? '#181A20' : '#FFF';
  const borderColor = colorScheme === 'dark' ? '#333' : '#E0E0E0';
  const textPrimary = colorScheme === 'dark' ? '#FFF' : '#222';
  const textSecondary = colorScheme === 'dark' ? '#AAA' : '#666';

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ThemedView style={[styles.outer, { backgroundColor: colorScheme === 'dark' ? '#101014' : '#F5F6FA' }]}> 
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center' }}
        >
          <ThemedView style={[styles.card, { backgroundColor: bgCard, borderColor }]}> 
            <ThemedText style={[styles.title, { color: textPrimary }]}>Support</ThemedText>
            <ThemedText style={[styles.sectionTitle, { color: textPrimary }]}>Contact Us</ThemedText>
            <ThemedText style={[styles.info, { color: textSecondary }]}>Email: support@velointl.com</ThemedText>
            <ThemedText style={[styles.info, { color: textSecondary, marginTop: 18 }]}>For any queries or support, please reach out to us at <ThemedText style={{ color: textPrimary, fontWeight: '700' }}>support@velointl.com</ThemedText>.</ThemedText>
          </ThemedView>
        </KeyboardAvoidingView>
      </ThemedView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 18,
    padding: 24,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    alignSelf: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 18,
    textAlign: 'center',
    letterSpacing: 0.1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 10,
  },
  info: {
    fontSize: 14,
    marginBottom: 2,
    textAlign: 'center',
  },
});

export default Support;