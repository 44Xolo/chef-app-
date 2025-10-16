import { CourseType, CourseOption } from '.';

export const COURSE_OPTIONS: CourseOption[] = [
  { 
    label: 'Starters', 
    value: 'starter', 
    icon: 'food-apple', 
    color: '#FF6B35' 
  },
  { 
    label: 'Main Courses', 
    value: 'main', 
    icon: 'food', 
    color: '#F7931E' 
  },
  { 
    label: 'Desserts', 
    value: 'dessert', 
    icon: 'cupcake', 
    color: '#E74C3C' 
  },
  { 
    label: 'Drinks', 
    value: 'drink', 
    icon: 'glass-cocktail', 
    color: '#3498DB' 
  }
];

export const getCourseIcon = (course: CourseType): string => {
  return COURSE_OPTIONS.find(option => option.value === course)?.icon || 'food';
};

export const getCourseLabel = (course: CourseType): string => {
  return COURSE_OPTIONS.find(option => option.value === course)?.label || 'Unknown';
};

export const getCourseColor = (course: CourseType): string => {
  return COURSE_OPTIONS.find(option => option.value === course)?.color || '#FF6B35';
};