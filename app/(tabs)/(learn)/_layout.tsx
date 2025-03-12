import { Stack } from 'expo-router';

export default function LearnLayout() {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen
        name="index"
        options={{
          title: 'Learn'
        }}
      />
      <Stack.Screen
        name="course-details"
        options={{
          title: 'Course Details'
        }}
      />
      <Stack.Screen
        name="lesson"
        options={{
          title: 'Lesson'
        }}
      />
      <Stack.Screen
        name="quiz"
        options={{
          title: 'Quiz'
        }}
      />
    </Stack>
  );
}