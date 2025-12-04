import { User, UserRole, Course, Assignment, Notification } from '../types';

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Alex Student', role: UserRole.STUDENT, email: 'alex@edu.com', avatar: 'https://picsum.photos/200' },
  { id: 'u2', name: 'Sarah Teacher', role: UserRole.TEACHER, email: 'sarah@edu.com', avatar: 'https://picsum.photos/201' },
  { id: 'u3', name: 'John Parent', role: UserRole.PARENT, email: 'john@edu.com', avatar: 'https://picsum.photos/202' },
  { id: 'u4', name: 'Admin Master', role: UserRole.ADMIN, email: 'admin@edu.com', avatar: 'https://picsum.photos/203' },
];

export const MOCK_COURSES: Course[] = [
  { id: 'c1', title: 'Advanced Mathematics', instructor: 'Sarah Teacher', progress: 75, thumbnail: 'https://picsum.photos/400/200', description: 'Calculus and Linear Algebra.', lessons: 24 },
  { id: 'c2', title: 'Physics 101', instructor: 'Dr. Einstein', progress: 30, thumbnail: 'https://picsum.photos/400/201', description: 'Introduction to Mechanics.', lessons: 18 },
  { id: 'c3', title: 'World History', instructor: 'Mr. Jones', progress: 0, thumbnail: 'https://picsum.photos/400/202', description: 'From Ancient Civilizations to Modern Era.', lessons: 32 },
  { id: 'c4', title: 'Computer Science', instructor: 'Ms. Ada', progress: 90, thumbnail: 'https://picsum.photos/400/203', description: 'Algorithms and Data Structures.', lessons: 40 },
];

export const MOCK_ASSIGNMENTS: Assignment[] = [
  { id: 'a1', title: 'Calculus Problem Set 3', dueDate: '2023-10-25', courseId: 'c1', status: 'PENDING' },
  { id: 'a2', title: 'Physics Lab Report', dueDate: '2023-10-20', courseId: 'c2', status: 'SUBMITTED' },
  { id: 'a3', title: 'History Essay', dueDate: '2023-10-15', courseId: 'c3', status: 'GRADED', grade: 'A-' },
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 'n1', title: 'New Assignment', message: 'Math homework posted.', date: '2h ago', read: false },
  { id: 'n2', title: 'Class Cancelled', message: 'History class is cancelled today.', date: '5h ago', read: true },
  { id: 'n3', title: 'Grade Posted', message: 'Your physics lab has been graded.', date: '1d ago', read: true },
];
