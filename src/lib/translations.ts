export const translations = {
  en: {
    // Navigation
    dashboard: 'Dashboard',
    transactions: 'Transactions',
    categories: 'Categories',
    budgets: 'Budgets',
    analytics: 'Analytics',
    reports: 'Reports',
    settings: 'Settings',
    
    // Common
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    create: 'Create',
    update: 'Update',
    loading: 'Loading...',
    
    // Dashboard
    welcomeBack: 'Welcome back',
    totalBalance: 'Total Balance',
    totalIncome: 'Total Income',
    totalExpenses: 'Total Expenses',
    recentTransactions: 'Recent Transactions',
    noTransactions: 'No transactions yet',
    addFirstTransaction: 'Add your first transaction to get started',
    
    // Transactions
    manageTransactions: 'Manage all your income and expenses',
    addTransaction: 'Add Transaction',
    description: 'Description',
    amount: 'Amount',
    category: 'Category',
    date: 'Date',
    type: 'Type',
    income: 'Income',
    expense: 'Expense',
    
    // Categories
    organizeCategories: 'Organize your transactions with custom categories',
    addCategory: 'Add Category',
    categoryName: 'Category Name',
    icon: 'Icon',
    color: 'Color',
    
    // Settings
    accountPreferences: 'Manage your account preferences and application settings',
    profile: 'Profile',
    preferences: 'Preferences',
    appearance: 'Appearance',
    notifications: 'Notifications',
    privacy: 'Privacy & Data',
    currency: 'Currency',
    language: 'Language',
    theme: 'Theme',
    
    // Theme
    light: 'Light',
    dark: 'Dark',
    system: 'System',
  },
  hi: {
    // Navigation
    dashboard: 'डैशबोर्ड',
    transactions: 'लेन-देन',
    categories: 'श्रेणियां',
    budgets: 'बजट',
    analytics: 'विश्लेषण',
    reports: 'रिपोर्ट',
    settings: 'सेटिंग्स',
    
    // Common
    save: 'सेव करें',
    cancel: 'रद्द करें',
    delete: 'हटाएं',
    edit: 'संपादित करें',
    add: 'जोड़ें',
    create: 'बनाएं',
    update: 'अपडेट करें',
    loading: 'लोड हो रहा है...',
    
    // Dashboard
    welcomeBack: 'वापस स्वागत है',
    totalBalance: 'कुल बैलेंस',
    totalIncome: 'कुल आय',
    totalExpenses: 'कुल खर्च',
    recentTransactions: 'हाल के लेन-देन',
    noTransactions: 'अभी तक कोई लेन-देन नहीं',
    addFirstTransaction: 'शुरुआत करने के लिए अपना पहला लेन-देन जोड़ें',
    
    // Transactions
    manageTransactions: 'अपनी सभी आय और खर्चों का प्रबंधन करें',
    addTransaction: 'लेन-देन जोड़ें',
    description: 'विवरण',
    amount: 'राशि',
    category: 'श्रेणी',
    date: 'तारीख',
    type: 'प्रकार',
    income: 'आय',
    expense: 'खर्च',
    
    // Categories
    organizeCategories: 'कस्टम श्रेणियों के साथ अपने लेन-देन को व्यवस्थित करें',
    addCategory: 'श्रेणी जोड़ें',
    categoryName: 'श्रेणी का नाम',
    icon: 'आइकन',
    color: 'रंग',
    
    // Settings
    accountPreferences: 'अपने खाता प्राथमिकताओं और एप्लिकेशन सेटिंग्स का प्रबंधन करें',
    profile: 'प्रोफ़ाइल',
    preferences: 'प्राथमिकताएं',
    appearance: 'दिखावट',
    notifications: 'सूचनाएं',
    privacy: 'गोपनीयता और डेटा',
    currency: 'मुद्रा',
    language: 'भाषा',
    theme: 'थीम',
    
    // Theme
    light: 'हल्का',
    dark: 'गहरा',
    system: 'सिस्टम',
  }
} as const;

export type Language = keyof typeof translations;
export type TranslationKey = keyof typeof translations.en;

export function getTranslation(key: TranslationKey, language: Language = 'en'): string {
  return translations[language]?.[key] || translations.en[key] || key;
}

export function formatTranslation(key: TranslationKey, language: Language = 'en', params: Record<string, string> = {}): string {
  let text = getTranslation(key, language);
  
  // Replace placeholders like {name} with actual values
  Object.entries(params).forEach(([param, value]) => {
    text = text.replace(new RegExp(`{${param}}`, 'g'), value);
  });
  
  return text;
}
