import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
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

  const handleKeyPress = (digit: string) => {
    if (pin.length < 4) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setPin((prev) => prev + digit);
    }
  };

  const handleDelete = () => {
    if (pin.length > 0) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setPin((prev) => prev.slice(0, -1));
    }
  };

  const handleClear = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setPin('');
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

      const response: any = await postArrivedHome(pin, lat, long);

      if (response && response.success === false) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        Alert.alert('Incorrect PIN', response.message || 'The entered PIN is incorrect. Please try again.');
        setPin('');
        return;
      }

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
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>🛡️ Parent / Guardian Zone</Text>
        </View>

        <Text style={styles.title}>Confirm Arrival Home</Text>
        <Text style={styles.subtitle}>
          Enter your 4-digit PIN to verify student has safely arrived home.
        </Text>

        {/* 4 PIN Boxes */}
        <View style={styles.pinContainer}>
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
        </View>

        {/* On-Screen Numeric Keypad */}
        <View style={styles.keypad}>
          <View style={styles.keypadRow}>
            {['1', '2', '3'].map((num) => (
              <TouchableOpacity
                key={num}
                style={styles.keypadKey}
                onPress={() => handleKeyPress(num)}
                activeOpacity={0.7}
              >
                <Text style={styles.keypadText}>{num}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.keypadRow}>
            {['4', '5', '6'].map((num) => (
              <TouchableOpacity
                key={num}
                style={styles.keypadKey}
                onPress={() => handleKeyPress(num)}
                activeOpacity={0.7}
              >
                <Text style={styles.keypadText}>{num}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.keypadRow}>
            {['7', '8', '9'].map((num) => (
              <TouchableOpacity
                key={num}
                style={styles.keypadKey}
                onPress={() => handleKeyPress(num)}
                activeOpacity={0.7}
              >
                <Text style={styles.keypadText}>{num}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.keypadRow}>
            <TouchableOpacity
              style={[styles.keypadKey, styles.keypadKeySpecial]}
              onPress={handleClear}
              activeOpacity={0.7}
            >
              <Text style={[styles.keypadText, { fontSize: 14, color: '#64748b' }]}>
                CLEAR
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.keypadKey}
              onPress={() => handleKeyPress('0')}
              activeOpacity={0.7}
            >
              <Text style={styles.keypadText}>0</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.keypadKey, styles.keypadKeySpecial]}
              onPress={handleDelete}
              activeOpacity={0.7}
            >
              <Text style={[styles.keypadText, { fontSize: 20 }]}>⌫</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Big Confirmation Button */}
        <TouchableOpacity
          style={[
            styles.confirmButton,
            (pin.length !== 4 || loading) && styles.confirmButtonDisabled,
          ]}
          onPress={handleConfirmArrival}
          disabled={pin.length !== 4 || loading}
          activeOpacity={0.82}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.confirmButtonText}>
              ✓ Confirm Student Arrived Home
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ParentPin;
