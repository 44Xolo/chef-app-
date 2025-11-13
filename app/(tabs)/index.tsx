export interface MenuItem {
  id: string;
  name: string;
  description: string;
  course: CourseType;
  price: number;
}

export type CourseType = 'starter' | 'main' | 'dessert' | 'drink';

export interface CourseOption {
  label: string;
  value: CourseType;
  icon: string;
  color: string;
}