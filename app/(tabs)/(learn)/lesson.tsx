import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useSession } from '@/app/_layout';
import { Feather } from '@expo/vector-icons';
import { LearningService, Course, Lesson } from '@/services/LearningService';
import { QuickCheck, LessonContent } from '@/types/learning';

// Define an extended lesson type that combines the API Lesson with optional LessonContent properties.
type ExtendedLesson = Lesson & Partial<LessonContent>;

// Import all lesson content from modules – update keys to match your new course IDs.
import { lessons as moneyBasicsLessons } from './content/moneyBasics';
import { lessons as savingGoalsLessons } from './content/savingAndSmartGoals';
import { lessons as investingLessons } from './content/investingMadeEasy';
import { lessons as financialPlanningLessons } from './content/financialPlanning';
import { lessons as understandingDebtLessons } from './content/understandingDebt';
import { lessons as debtAndLoansLessons } from './content/debtAndLoans';
import { lessons as retirementPlanningLessons } from './content/retirementPlanning';
import { lessons as cryptoLessons } from './content/cryptoAndDigitalFinance';
import { lessons as cybersecurityLessons } from './content/cybersecurityFraudPrevention';

// Updated mapping: keys match the new Supabase module_id values.
const allLessonsContent: Record<string, LessonContent[]> = {
  'money-basics': moneyBasicsLessons,
  'investing-made-easy': investingLessons,
  'debt-and-loans': debtAndLoansLessons,
  'understanding-debt': understandingDebtLessons,
  'saving-smart-goals': savingGoalsLessons,
  'financial-planning-future': financialPlanningLessons,
  'crypto-digital-finance': cryptoLessons,
  'cybersecurity-fraud-prevention': cybersecurityLessons, // Placeholder until local content is available.
  'retirement-long-term': retirementPlanningLessons
};

const QuickCheckQuiz: React.FC<{
  quickCheck: QuickCheck;
  onComplete: (correct: boolean) => void;
}> = ({ quickCheck, onComplete }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleOptionSelect = (optionId: string) => {
    if (hasSubmitted) return;
    setSelectedOption(optionId);
  };

  const handleSubmit = () => {
    if (!selectedOption || hasSubmitted) return;
    const selected = quickCheck.options.find(opt => opt.id === selectedOption);
    const correct = selected?.correct || false;
    setIsCorrect(correct);
    setHasSubmitted(true);
    setTimeout(() => {
      onComplete(correct);
    }, 1500);
  };

  return (
    <View style={styles.quickCheckContainer}>
      <Text style={styles.quickCheckTitle}>Quick Check</Text>
      <Text style={styles.quickCheckQuestion}>{quickCheck.question}</Text>
      <View style={styles.optionsContainer}>
        {quickCheck.options.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.optionButton,
              selectedOption === option.id && styles.selectedOption,
              hasSubmitted && selectedOption === option.id && (
                option.correct ? styles.correctOption : styles.incorrectOption
              )
            ]}
            onPress={() => handleOptionSelect(option.id)}
            disabled={hasSubmitted}
          >
            <Text
              style={[
                styles.optionText,
                selectedOption === option.id && styles.selectedOptionText,
                hasSubmitted && selectedOption === option.id && (
                  option.correct ? styles.correctOptionText : styles.incorrectOptionText
                )
              ]}
            >
              {option.text}
            </Text>
            {hasSubmitted && selectedOption === option.id && (
              <View style={styles.resultIcon}>
                <Feather name={option.correct ? "check" : "x"} size={18} color="#FFFFFF" />
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>
      {!hasSubmitted && (
        <TouchableOpacity
          style={[styles.submitButton, !selectedOption && styles.submitDisabledButton]}
          onPress={handleSubmit}
          disabled={!selectedOption}
        >
          <Text style={styles.submitButtonText}>Check Answer</Text>
        </TouchableOpacity>
      )}
      {hasSubmitted && (
        <View
          style={[
            styles.feedbackContainer,
            isCorrect ? styles.correctFeedback : styles.incorrectFeedback
          ]}
        >
          <Feather
            name={isCorrect ? "check-circle" : "alert-circle"}
            size={24}
            color={isCorrect ? "#4CD964" : "#FF3B30"}
          />
          <Text
            style={[
              styles.feedbackText,
              isCorrect ? styles.correctFeedbackText : styles.incorrectFeedbackText
            ]}
          >
            {isCorrect ? "Correct! Great job!" : "Incorrect. Keep learning!"}
          </Text>
        </View>
      )}
    </View>
  );
};

const LessonScreen = () => {
  const { courseId, lessonId, index } = useLocalSearchParams<{ 
    courseId: string;
    lessonId: string;
    index: string;
  }>();
  const router = useRouter();
  const { session } = useSession();
  const [course, setCourse] = useState<Course | null>(null);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [lessonContent, setLessonContent] = useState<LessonContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [completed, setCompleted] = useState(false);

  // Fetch lesson details and content
  const fetchLessonDetails = async () => {
    if (!session?.user?.id || !courseId || !lessonId) return;
    try {
      setLoading(true);
      const allCourses = await LearningService.getUserCourses(session.user.id);
      const thisCourse = allCourses.find(c => c.id === courseId);
      if (!thisCourse) {
        Alert.alert('Error', 'Course not found');
        router.back();
        return;
      }
      setCourse(thisCourse);
      const courseLessons = await LearningService.getCourseLessons(courseId, session.user.id);
      const thisLesson = courseLessons.find(l => l.id === lessonId);
      if (!thisLesson) {
        Alert.alert('Error', 'Lesson not found');
        router.back();
        return;
      }
      setLesson(thisLesson);
      setCompleted(thisLesson.completed || false);
      console.log('=== DEBUG INFO ===');
      console.log('Course:', {
        id: thisCourse.id,
        title: thisCourse.title,
        module_id: thisCourse.module_id
      });
      console.log('Lesson:', {
        id: thisLesson.id,
        title: thisLesson.title,
        content_id: thisLesson.content_id
      });
      if (thisCourse.module_id && allLessonsContent[thisCourse.module_id] && thisLesson.content_id) {
        const found = allLessonsContent[thisCourse.module_id].some(l => l.id === thisLesson.content_id);
        console.log(`Content found: ${found}`);
        if (!found) {
          console.log('Available content_ids:', allLessonsContent[thisCourse.module_id].map(l => l.id));
        }
      }
      console.log('=== END DEBUG ===');
      if (thisCourse.module_id && thisLesson.content_id) {
        const moduleContent = allLessonsContent[thisCourse.module_id];
        if (moduleContent) {
          const matchedContent = moduleContent.find(l => l.id === thisLesson.content_id);
          if (matchedContent) {
            console.log(`Matched lesson content: ${matchedContent.title}`);
            setLessonContent(matchedContent);
          } else {
            console.error(`No matching content found for content_id "${thisLesson.content_id}"`);
          }
        } else {
          console.error(`No content module found for module_id "${thisCourse.module_id}"`);
        }
      } else {
        console.error('Missing module_id or content_id on lesson or course');
      }
    } catch (err) {
      console.error('Error fetching lesson details:', err);
      Alert.alert('Error', 'Failed to load lesson. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLessonDetails();
  }, [session, courseId, lessonId]);

  const handleComplete = async (fromQuiz: boolean = false, quizCorrect: boolean = true) => {
    if (!session?.user?.id || !courseId || !lessonId) return;
    if (completed) return;
    try {
      setCompleting(true);
      if (fromQuiz && !quizCorrect) {
        setCompleting(false);
        return;
      }
      const success = await LearningService.completeLessonAndEarnXP(session.user.id, lessonId);
      if (success) {
        setCompleted(true);
        if (!fromQuiz) {
          Alert.alert(
            'Lesson Completed!',
            `You've earned ${lesson?.xp_reward || 0} XP.`,
            [{ text: 'Great!' }]
          );
        }
      } else {
        Alert.alert('Error', 'Failed to mark lesson as complete. Please try again.');
      }
    } catch (err) {
      console.error('Error completing lesson:', err);
      Alert.alert('Error', 'Failed to mark lesson as complete. Please try again.');
    } finally {
      setCompleting(false);
    }
  };

  const handleQuizComplete = (correct: boolean) => {
    handleComplete(true, correct);
    if (correct) {
      setTimeout(() => router.back(), 2000);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ headerTitle: 'Lesson', headerShown: true }} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#7C00FE" />
        </View>
      </SafeAreaView>
    );
  }

  if (!lesson || !course) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ headerTitle: 'Lesson', headerShown: true }} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Lesson not found</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Merge API lesson with local content. This ensures that all required properties from Lesson are preserved.
  const content: ExtendedLesson = { ...lesson, ...lessonContent };
  const quiz = content.quiz || null;
  const image = content.image;
  const imageCaption = content.imageCaption;
  const sections = content.sections;
  const tip = content.tip;

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: content.title || lesson.title,
          headerShown: true,
        }}
      />
      <ScrollView style={styles.scrollView}>
        <View style={styles.contentContainer}>
          <Text style={styles.lessonTitle}>{content.title || lesson.title}</Text>
          <View style={styles.lessonMeta}>
            <View style={styles.lessonMetaItem}>
              <Feather name="book" size={14} color="#666" />
              <Text style={styles.lessonMetaText}>{course.title}</Text>
            </View>
            <View style={styles.lessonMetaItem}>
              <Feather name="award" size={14} color="#666" />
              <Text style={styles.lessonMetaText}>{content.xp_reward || lesson.xp_reward} XP</Text>
            </View>
          </View>
          <View style={styles.lessonContent}>
            <Text style={styles.lessonText}>{content.content || lesson.content}</Text>
            {image && (
              <View style={styles.imageContainer}>
                <Image source={{ uri: image }} style={styles.lessonImage} resizeMode="contain" />
                {imageCaption && (
                  <Text style={styles.imageCaption}>{imageCaption}</Text>
                )}
              </View>
            )}
            {sections && sections.map((section, index) => (
              <View key={index}>
                <Text style={styles.lessonSubheading}>{section.title}</Text>
                <Text style={styles.lessonText}>{section.content}</Text>
              </View>
            ))}
            {tip && (
              <View style={styles.tipContainer}>
                <Feather name="info" size={24} color="#7C00FE" />
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            )}
            {!completed && showQuiz && quiz && (
              <QuickCheckQuiz quickCheck={quiz} onComplete={handleQuizComplete} />
            )}
          </View>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerButton} onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color="#333" />
          <Text style={styles.footerButtonText}>Back</Text>
        </TouchableOpacity>
        {!completed ? (
          <TouchableOpacity
            style={[styles.completeButton, completing && styles.buttonDisabled]}
            onPress={() => !showQuiz ? setShowQuiz(true) : null}
            disabled={completing || showQuiz}
          >
            {completing ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.completeButtonText}>
                {showQuiz ? 'Complete Above Quiz' : 'Continue'}
              </Text>
            )}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.completedButton} onPress={() => router.back()}>
            <Feather name="check-circle" size={20} color="#FFFFFF" />
            <Text style={styles.completeButtonText}>Completed</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  errorText: { fontSize: 18, color: '#666', marginBottom: 20 },
  backButton: { backgroundColor: '#7C00FE', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8 },
  backButtonText: { color: '#FFF', fontWeight: '600' },
  scrollView: { flex: 1 },
  contentContainer: { padding: 20, paddingBottom: 100 },
  lessonTitle: { fontSize: 24, fontWeight: '700', color: '#333', marginBottom: 12 },
  lessonMeta: { flexDirection: 'row', marginBottom: 24 },
  lessonMetaItem: { flexDirection: 'row', alignItems: 'center', marginRight: 16 },
  lessonMetaText: { fontSize: 14, color: '#666', marginLeft: 6 },
  lessonContent: { marginBottom: 40 },
  lessonText: { fontSize: 16, lineHeight: 24, color: '#333', marginBottom: 20 },
  lessonSubheading: { fontSize: 18, fontWeight: '700', color: '#333', marginBottom: 10, marginTop: 10 },
  imageContainer: { marginVertical: 20, alignItems: 'center' },
  lessonImage: { width: '100%', height: 200, borderRadius: 8 },
  imageCaption: { fontSize: 14, color: '#666', fontStyle: 'italic', marginTop: 8, textAlign: 'center' },
  tipContainer: { flexDirection: 'row', backgroundColor: 'rgba(124, 0, 254, 0.1)', padding: 16, borderRadius: 8, marginVertical: 20 },
  tipText: { flex: 1, fontSize: 15, color: '#333', marginLeft: 12, lineHeight: 22 },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#FFFFFF', flexDirection: 'row', justifyContent: 'space-between', padding: 16, borderTopWidth: 1, borderTopColor: '#F0F0F0' },
  footerButton: { flexDirection: 'row', alignItems: 'center', padding: 10 },
  footerButtonText: { fontSize: 16, marginLeft: 8, color: '#333' },
  completeButton: { backgroundColor: '#7C00FE', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8, flexDirection: 'row', alignItems: 'center' },
  completedButton: { backgroundColor: '#4CD964', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8, flexDirection: 'row', alignItems: 'center' },
  completeButtonText: { color: '#FFFFFF', fontWeight: '600', fontSize: 16, marginLeft: 8 },
  buttonDisabled: { opacity: 0.7 },
  submitDisabledButton: { opacity: 0.5 },
  quickCheckContainer: { backgroundColor: '#F8F9FA', borderRadius: 12, padding: 20, marginVertical: 20, borderWidth: 1, borderColor: '#E0E0E0' },
  quickCheckTitle: { fontSize: 20, fontWeight: '700', color: '#333', marginBottom: 12, textAlign: 'center' },
  quickCheckQuestion: { fontSize: 16, color: '#333', marginBottom: 20, lineHeight: 24 },
  optionsContainer: { marginBottom: 20 },
  optionButton: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 8, padding: 16, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  selectedOption: { borderColor: '#7C00FE', backgroundColor: 'rgba(124, 0, 254, 0.05)' },
  correctOption: { borderColor: '#4CD964', backgroundColor: 'rgba(76, 217, 100, 0.05)' },
  incorrectOption: { borderColor: '#FF3B30', backgroundColor: 'rgba(255, 59, 48, 0.05)' },
  optionText: { fontSize: 16, color: '#333', flex: 1 },
  selectedOptionText: { color: '#7C00FE', fontWeight: '600' },
  correctOptionText: { color: '#4CD964', fontWeight: '600' },
  incorrectOptionText: { color: '#FF3B30', fontWeight: '600' },
  resultIcon: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#4CD964', justifyContent: 'center', alignItems: 'center' },
  submitButton: { backgroundColor: '#7C00FE', paddingVertical: 14, borderRadius: 8, alignItems: 'center' },
  submitButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  feedbackContainer: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 8, marginTop: 20 },
  correctFeedback: { backgroundColor: 'rgba(76, 217, 100, 0.1)' },
  incorrectFeedback: { backgroundColor: 'rgba(255, 59, 48, 0.1)' },
  feedbackText: { fontSize: 16, marginLeft: 12 },
  correctFeedbackText: { color: '#4CD964' },
  incorrectFeedbackText: { color: '#FF3B30' },
});

export default LessonScreen;
