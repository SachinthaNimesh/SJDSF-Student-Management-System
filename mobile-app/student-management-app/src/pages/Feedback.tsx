import React, { useState } from 'react';
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
import { postStudentFeedback } from '../api/attendanceService';
import styles from './Feedback.styles';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

const Feedback: React.FC<Props> = ({ navigation }) => {
  const [feedbackText, setFeedbackText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (loading) return;
    try {
      setLoading(true);
      if (feedbackText.trim() !== '') {
        await postStudentFeedback(feedbackText.trim());
      }
      navigation.replace('ParentPin');
    } catch (error) {
      console.warn('Could not post feedback immediately (queued if offline):', error);
      // Navigate to ParentPin even if offline because apiQueue queued the request
      navigation.replace('ParentPin');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    navigation.replace('ParentPin');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.card}>
          <Text style={styles.title}>Feedback</Text>
          <Text style={styles.subtitle}>
            How was work today? Leave any notes or comments below.
          </Text>

          <TextInput
            style={styles.textArea}
            placeholder="Type your feedback here..."
            placeholderTextColor="#a0aec0"
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
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.buttonText}>Submit & Continue</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.skipButton}
            onPress={handleSkip}
            disabled={loading}
          >
            <Text style={styles.skipButtonText}>Skip</Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default Feedback;