import { supabase } from '@/lib/supabase';

export interface Course {
  id: string;
  title: string;
  description: string;
  progress: number;
  lessons: number;
  completed_lessons: number;
  level: string;
  color: string;
  icon: string;
  created_at: string;
  order_number?: number;
}

export interface Lesson {
  id: string;
  course_id: string;
  title: string;
  description: string;
  content: string;
  xp_reward: number;
  order_number: number;
  created_at: string;
  completed?: boolean;
}

export interface UserLearningStats {
  id?: string;
  user_id: string;
  total_xp: number;
  streak_days: number;
  last_activity_date: string;
}

export class LearningService {
  /**
   * Get all courses available to the user with their progress.
   */
  static async getUserCourses(userId: string): Promise<Course[]> {
    try {
      const { data: courses, error } = await supabase
        .from('financial_courses')
        .select('*')
        .order('created_at', { ascending: true });
      if (error) {
        console.error('Error fetching courses:', JSON.stringify(error));
        return [];
      }

      const { data: userProgress, error: progressError } = await supabase
        .from('user_lesson_progress')
        .select('lesson_id, completed')
        .eq('user_id', userId);
      if (progressError) {
        console.error('Error fetching user progress:', JSON.stringify(progressError));
        return courses || [];
      }

      const { data: lessons, error: lessonsError } = await supabase
        .from('financial_lessons')
        .select('id, course_id');
      if (lessonsError) {
        console.error('Error fetching lessons:', JSON.stringify(lessonsError));
        return courses || [];
      }

      const coursesWithProgress = courses?.map(course => {
        const courseLessons = lessons?.filter(lesson => lesson.course_id === course.id) || [];
        const completedCourseLessons = courseLessons.filter(lesson =>
          userProgress?.some(progress => progress.lesson_id === lesson.id && progress.completed)
        );
        const completedLessons = completedCourseLessons.length;
        const totalLessons = courseLessons.length;
        const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
        return {
          ...course,
          progress,
          lessons: totalLessons,
          completed_lessons: completedLessons,
        };
      });
      return coursesWithProgress || [];
    } catch (err) {
      console.error('Error in getUserCourses:', err);
      return [];
    }
  }

  /**
   * Get lessons for a specific course with user progress.
   */
  static async getCourseLessons(courseId: string, userId: string): Promise<Lesson[]> {
    try {
      const { data: lessons, error } = await supabase
        .from('financial_lessons')
        .select('*')
        .eq('course_id', courseId)
        .order('order_number', { ascending: true });
      if (error) {
        console.error('Error fetching lessons:', JSON.stringify(error));
        return [];
      }
      const { data: userProgress, error: progressError } = await supabase
        .from('user_lesson_progress')
        .select('lesson_id, completed')
        .eq('user_id', userId);
      if (progressError) {
        console.error('Error fetching user progress:', JSON.stringify(progressError));
        return lessons || [];
      }
      const lessonsWithProgress = lessons?.map(lesson => ({
        ...lesson,
        completed:
          userProgress?.some(
            progress => progress.lesson_id === lesson.id && progress.completed
          ) || false,
      }));
      return lessonsWithProgress || [];
    } catch (err) {
      console.error('Error in getCourseLessons:', err);
      return [];
    }
  }

  /**
   * Mark a lesson as completed, update XP, streak, and course progress.
   */
  static async completeLessonAndEarnXP(userId: string, lessonId: string): Promise<boolean> {
    try {
      const { data: lesson, error: lessonError } = await supabase
        .from('financial_lessons')
        .select('xp_reward, course_id')
        .eq('id', lessonId)
        .single();
      if (lessonError) {
        console.error('Error fetching lesson details:', JSON.stringify(lessonError));
        return false;
      }
      const xpReward = lesson?.xp_reward || 0;
      const today = new Date().toISOString().split('T')[0];

      const { data: existingProgress, error: checkError } = await supabase
        .from('user_lesson_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('lesson_id', lessonId)
        .single();
      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking existing progress:', JSON.stringify(checkError));
        return false;
      }
      if (existingProgress?.completed) {
        console.log('Lesson was already completed');
        return true;
      }

      const progressOperation = existingProgress
        ? supabase
            .from('user_lesson_progress')
            .update({
              completed: true,
              xp_earned: xpReward,
              completed_at: new Date().toISOString(),
            })
            .eq('id', existingProgress.id)
        : supabase
            .from('user_lesson_progress')
            .insert({
              user_id: userId,
              lesson_id: lessonId,
              completed: true,
              xp_earned: xpReward,
              completed_at: new Date().toISOString(),
            });
      const { error: progressError } = await progressOperation;
      if (progressError) {
        console.error('Error updating lesson progress:', JSON.stringify(progressError));
        return false;
      }

      const { data: stats, error: statsError } = await supabase
        .from('user_learning_stats')
        .select('*')
        .eq('user_id', userId)
        .single();
      if (statsError && statsError.code !== 'PGRST116') {
        console.error('Error fetching learning stats:', JSON.stringify(statsError));
        return false;
      }

      let newStreakDays = 1;
      if (stats) {
        const lastActivity = new Date(stats.last_activity_date);
        const todayDate = new Date();
        const yesterday = new Date(todayDate);
        yesterday.setDate(yesterday.getDate() - 1);
        const lastActivityDate = lastActivity.toISOString().split('T')[0];
        const todayDateString = todayDate.toISOString().split('T')[0];
        const yesterdayString = yesterday.toISOString().split('T')[0];
        if (lastActivityDate === todayDateString) {
          newStreakDays = stats.streak_days;
        } else if (lastActivityDate === yesterdayString) {
          newStreakDays = stats.streak_days + 1;
        }
      }
      const statsOperation = stats
        ? supabase
            .from('user_learning_stats')
            .update({
              total_xp: stats.total_xp + xpReward,
              streak_days: newStreakDays,
              last_activity_date: today,
            })
            .eq('id', stats.id)
        : supabase
            .from('user_learning_stats')
            .insert({
              user_id: userId,
              total_xp: xpReward,
              streak_days: 1,
              last_activity_date: today,
            });
      const { error: updateStatsError } = await statsOperation;
      if (updateStatsError) {
        console.error('Error updating learning stats:', JSON.stringify(updateStatsError));
        return false;
      }

      // Update course progress: count completed lessons.
      const { data: courseLessons, error: courseLessonsError } = await supabase
        .from('financial_lessons')
        .select('id')
        .eq('course_id', lesson.course_id);
      if (courseLessonsError) {
        console.error('Error fetching lessons for course:', JSON.stringify(courseLessonsError));
      } else {
        const lessonIds = courseLessons.map(l => l.id) || [];
        console.log('Lesson IDs for course', lesson.course_id, ':', lessonIds);
        const { count: completedCount, error: countError } = await supabase
          .from('user_lesson_progress')
          .select('*', { count: 'exact' })
          .eq('user_id', userId)
          .eq('completed', true)
          .in('lesson_id', lessonIds);
        if (countError) {
          console.error('Error counting completed lessons:', JSON.stringify(countError));
        } else {
          const { error: updateCourseError } = await supabase
            .from('financial_courses')
            .update({ completed_lessons: completedCount })
            .eq('id', lesson.course_id);
          if (updateCourseError) {
            console.error('Error updating course progress:', JSON.stringify(updateCourseError));
          }
        }
      }
      return true;
    } catch (err) {
      console.error('Error completing lesson:', err);
      return false;
    }
  }

  /**
   * Get user learning stats (XP, streak, etc.).
   * If no stats are found, return default values.
   */
  static async getUserLearningStats(userId: string): Promise<UserLearningStats> {
    try {
      const { data, error } = await supabase
        .from('user_learning_stats')
        .select('*')
        .eq('user_id', userId)
        .single();
      if (error) {
        // If the error indicates no rows found, return defaults.
        if (error.code === 'PGRST116' || error.message.toLowerCase().includes('no rows')) {
          return {
            user_id: userId,
            total_xp: 0,
            streak_days: 0,
            last_activity_date: new Date().toISOString().split('T')[0],
          };
        }
        console.error('Error fetching user learning stats:', JSON.stringify(error));
        // Return defaults if there's an error.
        return {
          user_id: userId,
          total_xp: 0,
          streak_days: 0,
          last_activity_date: new Date().toISOString().split('T')[0],
        };
      }
      return data;
    } catch (err) {
      console.error('Error in getUserLearningStats:', err);
      return {
        user_id: userId,
        total_xp: 0,
        streak_days: 0,
        last_activity_date: new Date().toISOString().split('T')[0],
      };
    }
  }

  /**
   * Check if the user needs to log in today to maintain their streak.
   */
  static async checkStreakStatus(userId: string): Promise<{ currentStreak: number; needsToday: boolean }> {
    try {
      const stats = await this.getUserLearningStats(userId);
      const lastActivity = new Date(stats.last_activity_date);
      const today = new Date();
      const lastActivityDate = lastActivity.toISOString().split('T')[0];
      const todayDate = today.toISOString().split('T')[0];
      return {
        currentStreak: stats.streak_days,
        needsToday: lastActivityDate !== todayDate,
      };
    } catch (err) {
      console.error('Error checking streak status:', err);
      return { currentStreak: 0, needsToday: true };
    }
  }

  /**
   * Get the next lesson that the user should take (for "Continue Learning").
   */
  static async getNextLessonToTake(userId: string): Promise<{
    courseId: string;
    lessonId: string;
    courseTitle: string;
    lessonTitle: string;
  } | null> {
    try {
      const courses = await this.getUserCourses(userId);
      for (const course of courses) {
        if (course.progress < 100) {
          const lessons = await this.getCourseLessons(course.id, userId);
          const nextLesson = lessons.find(lesson => !lesson.completed);
          if (nextLesson) {
            return {
              courseId: course.id,
              lessonId: nextLesson.id,
              courseTitle: course.title,
              lessonTitle: nextLesson.title,
            };
          }
        }
      }
      return null;
    } catch (err) {
      console.error('Error finding next lesson:', err);
      return null;
    }
  }

  /**
   * Get level info based on total XP.
   */
  static getLevelInfo(xp: number): { level: number; currentXP: number; nextLevelXP: number } {
    const level = Math.floor(xp / 100) + 1;
    const currentXP = xp % 100;
    const nextLevelXP = 100;
    return { level, currentXP, nextLevelXP };
  }
}
