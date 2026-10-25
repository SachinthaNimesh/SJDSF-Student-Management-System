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
import * as Haptics from 'expo-haptics';
import { postStudentFeedback } from '../api/attendanceService';
import styles from './Feedback.styles';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

const QUICK_TAGS = [
  '🌟 Great day!',
  '😴 A bit tired',
  '🤝 Good teamwork',
  '💡 Learned new things',
  '👍 Finished my tasks',
];

const Feedback: React.FC<Props> = ({ navigation }) => {
  const [feedbackText, setFeedbackText] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleTagPress = (tag: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (selectedTag === tag) {
      setSelectedTag(null);
      setFeedbackText('');
    } else {
      setSelectedTag(tag);
      setFeedbackText(tag);
    }
  };

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

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.card}>
          <Text style={styles.title}>How was your day? 💬</Text>
          <Text style={styles.subtitle}>
            Tap a quick button or write your thoughts below:
          </Text>

          {/* Quick tap tags */}
          <View style={styles.tagsContainer}>
            {QUICK_TAGS.map((tag) => {
              const isSelected = selectedTag === tag;
              return (
                <TouchableOpacity
                  key={tag}
                  style={[styles.tagPill, isSelected && styles.tagPillSelected]}
                  onPress={() => handleTagPress(tag)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.tagPillText,
                      isSelected && styles.tagPillTextSelected,
                    ]}
                  >
                    {tag}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <TextInput
            style={styles.textArea}
            placeholder="Write any thoughts here..."
            placeholderTextColor="#94a3b8"
            multiline
            numberOfLines={4}
            value={feedbackText}
            onChangeText={(text) => {
              setFeedbackText(text);
              if (selectedTag && text !== selectedTag) {
                setSelectedTag(null);
              }
            }}
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
              <Text style={styles.buttonText}>Continue to Parent PIN ➔</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.skipButton}
            onPress={handleSkip}
            disabled={loading}
          >
            <Text style={styles.skipButtonText}>Skip this step</Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default Feedback;