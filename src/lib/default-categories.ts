import { CategoryFormData } from '@/types';

export const DEFAULT_EXPENSE_CATEGORIES: Omit<CategoryFormData, 'userId'>[] = [
  {
    name: 'Food & Dining',
    icon: '🍽️',
    color: '#FF6B6B',
    type: 'expense'
  },
  {
    name: 'Transportation',
    icon: '🚗',
    color: '#4ECDC4',
    type: 'expense'
  },
  {
    name: 'Shopping',
    icon: '🛍️',
    color: '#45B7D1',
    type: 'expense'
  },
  {
    name: 'Entertainment',
    icon: '🎬',
    color: '#96CEB4',
    type: 'expense'
  },
  {
    name: 'Bills & Utilities',
    icon: '💡',
    color: '#FFEAA7',
    type: 'expense'
  },
  {
    name: 'Healthcare',
    icon: '🏥',
    color: '#DDA0DD',
    type: 'expense'
  },
  {
    name: 'Education',
    icon: '📚',
    color: '#98D8C8',
    type: 'expense'
  },
  {
    name: 'Travel',
    icon: '✈️',
    color: '#F7DC6F',
    type: 'expense'
  },
  {
    name: 'Personal Care',
    icon: '💄',
    color: '#BB8FCE',
    type: 'expense'
  },
  {
    name: 'Other',
    icon: '📦',
    color: '#BDC3C7',
    type: 'expense'
  }
];

export const DEFAULT_INCOME_CATEGORIES: Omit<CategoryFormData, 'userId'>[] = [
  {
    name: 'Salary',
    icon: '💰',
    color: '#2ECC71',
    type: 'income'
  },
  {
    name: 'Freelance',
    icon: '💻',
    color: '#3498DB',
    type: 'income'
  },
  {
    name: 'Investment',
    icon: '📈',
    color: '#9B59B6',
    type: 'income'
  },
  {
    name: 'Business',
    icon: '🏢',
    color: '#E67E22',
    type: 'income'
  },
  {
    name: 'Gift',
    icon: '🎁',
    color: '#E74C3C',
    type: 'income'
  },
  {
    name: 'Other Income',
    icon: '💵',
    color: '#1ABC9C',
    type: 'income'
  }
];

export const ALL_DEFAULT_CATEGORIES = [
  ...DEFAULT_EXPENSE_CATEGORIES,
  ...DEFAULT_INCOME_CATEGORIES
];
