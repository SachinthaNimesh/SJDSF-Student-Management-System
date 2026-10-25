import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { postArrivedHome } from '../api/attendanceService';
import { getCurrentLocationOnce } from '../utils/location';
import styles from './ParentPin.styles';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

const ParentPin: React.FC<Props> = ({ navigation }) => {
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const handlePinChange = (text: string) => {
    // Only accept numeric digits, up to 4 characters
    const numericText = text.replace(/\D/g, '').slice(0, 4);
    setPin(numericText);
    if (numericText.length > pin.length) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleConfirmArrival = async () => {
    if (pin.length !== 4) {
      Alert.alert('Incomplete PIN', 'Please enter your 4-digit parent PIN.');
      return;
    }

    if (loading) return;

    try {
      setLoading(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

      // 1. Get current device location
      let lat = 0;
      let long = 0;
      try {
        const coords = await getCurrentLocationOnce();
        if (coords.latitude != null && coords.longitude != null) {
          lat = coords.latitude;
          long = coords.longitude;
        }
      } catch (locErr) {
        console.warn('Location retrieval warning:', locErr);
      }

      // 2. Post arrived home with PIN verification
      const response: any = await postArrivedHome(pin, lat, long);

      if (response && response.success === false) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        Alert.alert('Incorrect PIN', response.message || 'The entered PIN is incorrect. Please try again.');
        setPin('');
        return;
      }

      // Mark arrived home in storage
      const todayStr = new Date().toISOString().slice(0, 10);
      await AsyncStorage.setItem('ARRIVED_HOME_DATE', todayStr);

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      navigation.replace('CheckOutGreeting');
    } catch (error: any) {
      console.error('Error confirming arrived home:', error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert(
        'Verification Failed',
        error instanceof Error ? error.message : 'Invalid parent PIN or network error. Please try again.'
      );
      setPin('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={() => inputRef.current?.focus()}>
        <View style={styles.card}>
          <View style={styles.iconContainer}>
            <Text style={styles.iconText}>🏠</Text>
          </View>

          <Text style={styles.title}>Parent Verification</Text>
          <Text style={styles.subtitle}>
            Please enter your 4-digit PIN to confirm that the student has safely arrived home.
          </Text>

          {/* Hidden TextInput for native keyboard */}
          <TextInput
            ref={inputRef}
            style={styles.hiddenInput}
            keyboardType="number-pad"
            maxLength={4}
            value={pin}
            onChangeText={handlePinChange}
            autoFocus={true}
          />

          {/* 4 PIN display boxes */}
          <TouchableOpacity
            style={styles.pinContainer}
            activeOpacity={1}
            onPress={() => inputRef.current?.focus()}
          >
            {[0, 1, 2, 3].map((index) => {
              const digit = pin[index];
              const isFilled = digit !== undefined;
              return (
                <View
                  key={index}
                  style={[styles.pinBox, isFilled && styles.pinBoxFilled]}
                >
                  <Text style={styles.pinText}>{isFilled ? '●' : ''}</Text>
                </View>
              );
            })}
          </TouchableOpacity>

          {/* Confirmation Button */}
          <TouchableOpacity
            style={[
              styles.button,
              (pin.length !== 4 || loading) && styles.buttonDisabled,
            ]}
            onPress={handleConfirmArrival}
            disabled={pin.length !== 4 || loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.buttonText}>✓ Confirm Student Arrived Home</Text>
            )}
          </TouchableOpacity>

          <Text style={styles.hintText}>
            This action must be performed by the student's parent or guardian.
          </Text>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default ParentPin;
