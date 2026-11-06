import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { postStudentFeedback } from '../api/attendanceService';
import styles from './Feedback.styles';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

const Feedback: React.FC<Props> = ({ navigation }) => {
  const [feedbackText, setFeedbackText] = useState('');
  const [loading, setLoading] = useState(false);
  const [studentName, setStudentName] = useState('');

  useEffect(() => {
    AsyncStorage.getItem('student_first_name')
      .then((name) => {
        if (name) {
          setStudentName(name.trim());
        }
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async () => {
    if (loading) return;
    try {
      setLoading(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      if (feedbackText.trim() !== '') {
        await postStudentFeedback(feedbackText.trim());
      }
      navigation.replace('ParentPin');
    } catch (error) {
      console.warn('Could not post feedback immediately (queued if offline):', error);
      navigation.replace('ParentPin');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.replace('ParentPin');
  };

  const employeeName = studentName ? studentName : 'the employee';

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.contentWrapper}>
          <View style={styles.card}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>👔 Manager / Coworker Note</Text>
            </View>

            <Text style={styles.title}>
              How did {employeeName} do today? 📝
            </Text>
            <Text style={styles.subtitle}>
              Manager or coworker: Please write your daily observations about {employeeName}'s work shift below.
            </Text>

            <TextInput
              style={styles.textArea}
              placeholder={`Write observations here (e.g., completed assigned tasks on time, followed instructions well, great teamwork)...`}
              placeholderTextColor="#94a3b8"
              multiline
              numberOfLines={5}
              value={feedbackText}
              onChangeText={setFeedbackText}
              editable={!loading}
            />

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={loading}
              activeOpacity={0.82}
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.buttonText}>Save Feedback & Continue ➔</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.skipButton}
              onPress={handleSkip}
              disabled={loading}
              activeOpacity={0.7}
            >
              <Text style={styles.skipButtonText}>Skip (No notes today)</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default Feedback;