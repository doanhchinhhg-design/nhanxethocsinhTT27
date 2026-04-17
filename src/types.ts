export type Level = 'Tốt' | 'Đạt' | 'Chưa hoàn thành';
export type AssessmentPeriod = 'Giữa học kỳ I' | 'Cuối học kỳ I' | 'Giữa học kỳ II' | 'Cuối năm học';

export interface Student {
  id: string;
  name: string;
  className: string;
  level: Level;
  comment: string;
}

export interface CommentHistory {
  id: string;
  studentName: string;
  className: string;
  subject: string;
  level: Level;
  period: AssessmentPeriod;
  comment: string;
  createdAt: string;
}

export const PERIODS: AssessmentPeriod[] = [
  'Giữa học kỳ I',
  'Cuối học kỳ I',
  'Giữa học kỳ II',
  'Cuối năm học'
];

export const SUBJECTS = [
  'Toán', 'Tiếng Việt', 'Tiếng Anh', 'Đạo đức', 'Tự nhiên và Xã hội',
  'Lịch sử và Địa lý', 'Khoa học', 'Tin học', 'Công nghệ',
  'Giáo dục Thể chất', 'Âm nhạc', 'Mĩ thuật', 'Hoạt động trải nghiệm'
];
