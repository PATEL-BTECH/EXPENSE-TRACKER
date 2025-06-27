'use client';

import { useState, useRef } from 'react';
import AppLayout from '@/components/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  User,
  Globe,
  Palette,
  Bell,
  Shield,
  Download,
  Upload,
  Trash2,
  Save,
  Camera,
  X,
  Check
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

const CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
];

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिंदी (Hindi)' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ja', name: 'Japanese' },
];

const THEMES = [
  { value: 'light', name: 'Light' },
  { value: 'dark', name: 'Dark' },
  { value: 'system', name: 'System' },
];

// Predefined 2D Avatars
const PREDEFINED_AVATARS = [
  {
    id: 'avatar-1',
    name: 'Professional',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="50" fill="#4F46E5"/>
      <circle cx="50" cy="35" r="15" fill="#FFF"/>
      <path d="M25 75 Q25 60 50 60 Q75 60 75 75 L75 100 L25 100 Z" fill="#FFF"/>
    </svg>`
  },
  {
    id: 'avatar-2',
    name: 'Creative',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="50" fill="#EC4899"/>
      <circle cx="50" cy="35" r="15" fill="#FFF"/>
      <path d="M25 75 Q25 60 50 60 Q75 60 75 75 L75 100 L25 100 Z" fill="#FFF"/>
      <circle cx="35" cy="30" r="3" fill="#EC4899"/>
      <circle cx="65" cy="30" r="3" fill="#EC4899"/>
    </svg>`
  },
  {
    id: 'avatar-3',
    name: 'Friendly',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="50" fill="#10B981"/>
      <circle cx="50" cy="35" r="15" fill="#FFF"/>
      <path d="M25 75 Q25 60 50 60 Q75 60 75 75 L75 100 L25 100 Z" fill="#FFF"/>
      <path d="M40 40 Q50 45 60 40" stroke="#10B981" stroke-width="2" fill="none"/>
    </svg>`
  },
  {
    id: 'avatar-4',
    name: 'Tech Savvy',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="50" fill="#8B5CF6"/>
      <circle cx="50" cy="35" r="15" fill="#FFF"/>
      <path d="M25 75 Q25 60 50 60 Q75 60 75 75 L75 100 L25 100 Z" fill="#FFF"/>
      <rect x="40" y="25" width="20" height="3" fill="#8B5CF6" rx="1"/>
    </svg>`
  },
  {
    id: 'avatar-5',
    name: 'Minimalist',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="50" fill="#6B7280"/>
      <circle cx="50" cy="35" r="15" fill="#FFF"/>
      <path d="M25 75 Q25 60 50 60 Q75 60 75 75 L75 100 L25 100 Z" fill="#FFF"/>
    </svg>`
  },
  {
    id: 'avatar-6',
    name: 'Energetic',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="50" fill="#F59E0B"/>
      <circle cx="50" cy="35" r="15" fill="#FFF"/>
      <path d="M25 75 Q25 60 50 60 Q75 60 75 75 L75 100 L25 100 Z" fill="#FFF"/>
      <circle cx="42" cy="32" r="2" fill="#F59E0B"/>
      <circle cx="58" cy="32" r="2" fill="#F59E0B"/>
    </svg>`
  },
  {
    id: 'avatar-7',
    name: 'Cool',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="50" fill="#06B6D4"/>
      <circle cx="50" cy="35" r="15" fill="#FFF"/>
      <path d="M25 75 Q25 60 50 60 Q75 60 75 75 L75 100 L25 100 Z" fill="#FFF"/>
      <rect x="35" y="28" width="30" height="4" fill="#06B6D4" rx="2"/>
    </svg>`
  },
  {
    id: 'avatar-8',
    name: 'Elegant',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="50" fill="#DC2626"/>
      <circle cx="50" cy="35" r="15" fill="#FFF"/>
      <path d="M25 75 Q25 60 50 60 Q75 60 75 75 L75 100 L25 100 Z" fill="#FFF"/>
      <path d="M35 20 Q50 15 65 20" stroke="#DC2626" stroke-width="2" fill="none"/>
    </svg>`
  }
];

export default function SettingsPage() {
  const { user, updateUser } = useAuth();
  const { language, setLanguage } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [settings, setSettings] = useState({
    currency: user?.preferences?.currency || 'INR',
    language: user?.preferences?.language || 'en',
    theme: user?.preferences?.theme || 'system',
    notifications: {
      email: true,
      push: false,
      budgetAlerts: true,
      weeklyReports: true,
    },
    privacy: {
      dataSharing: false,
      analytics: true,
      marketing: false,
    }
  });

  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    avatar: user?.avatar || '',
  });

  const [showAvatarModal, setShowAvatarModal] = useState(false);

  const handleSaveSettings = () => {
    // In a real app, this would make an API call to save settings
    toast.success('Settings saved successfully');
  };

  const handleSaveProfile = () => {
    // Update the user in AuthContext and localStorage
    updateUser({
      name: profile.name,
      email: profile.email,
      avatar: profile.avatar
    });

    toast.success('Profile updated successfully');
  };

  const handleAvatarChange = () => {
    setShowAvatarModal(true);
  };

  const handleUploadAvatar = () => {
    fileInputRef.current?.click();
    setShowAvatarModal(false);
  };

  const handleSelectPredefinedAvatar = (avatarSvg: string) => {
    const svgDataUrl = `data:image/svg+xml;base64,${btoa(avatarSvg)}`;
    setProfile({ ...profile, avatar: svgDataUrl });
    setShowAvatarModal(false);
    toast.success('Avatar updated! Don\'t forget to save your profile.');
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        toast.error('Please select a valid image file (JPG, PNG, or GIF)');
        return;
      }

      // Validate file size (2MB limit)
      const maxSize = 2 * 1024 * 1024; // 2MB in bytes
      if (file.size > maxSize) {
        toast.error('File size must be less than 2MB');
        return;
      }

      // Create a preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setProfile({ ...profile, avatar: result });
        toast.success('Avatar updated! Don\'t forget to save your profile.');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExportData = () => {
    // Mock export functionality
    toast.success('Data export started. You will receive an email when ready.');
  };

  const handleImportData = () => {
    // Mock import functionality
    toast.success('Data import feature coming soon');
  };

  const handleDeleteAccount = () => {
    // Mock delete account functionality
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      toast.error('Account deletion feature coming soon');
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="text-gray-600 dark:text-gray-300">Manage your account preferences and application settings</p>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Preferences
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Appearance
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Privacy & Data
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center overflow-hidden">
                    {profile.avatar ? (
                      profile.avatar.startsWith('data:image/svg+xml') ? (
                        <div
                          className="w-full h-full"
                          dangerouslySetInnerHTML={{ __html: atob(profile.avatar.split(',')[1]) }}
                        />
                      ) : (
                        <img
                          src={profile.avatar}
                          alt="Avatar"
                          className="w-full h-full object-cover"
                        />
                      )
                    ) : (
                      <User className="w-8 h-8 text-white" />
                    )}
                  </div>
                  <div>
                    <Button variant="outline" size="sm" onClick={handleAvatarChange}>
                      <Camera className="w-4 h-4 mr-2" />
                      Change Avatar
                    </Button>
                    <p className="text-sm text-gray-500 mt-1">Choose from presets or upload your own (JPG, PNG, GIF. Max 2MB)</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/gif"
                      onChange={handleFileChange}
                      className="hidden"
                      aria-label="Upload avatar image"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    />
                  </div>
                </div>
                
                <Button onClick={handleSaveProfile}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Profile
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Regional Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Default Currency</Label>
                    <Select 
                      value={settings.currency} 
                      onValueChange={(value) => setSettings({ ...settings, currency: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CURRENCIES.map((currency) => (
                          <SelectItem key={currency.code} value={currency.code}>
                            {currency.symbol} {currency.name} ({currency.code})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Language</Label>
                    <Select
                      value={settings.language}
                      onValueChange={(value) => {
                        setSettings({ ...settings, language: value });
                        setLanguage(value as 'en' | 'hi');
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {LANGUAGES.map((language) => (
                          <SelectItem key={language.code} value={language.code}>
                            {language.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <Button onClick={handleSaveSettings}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Preferences
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance Tab */}
          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Theme Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Theme</Label>
                  <Select
                    value={settings.theme}
                    onValueChange={(value: 'light' | 'dark' | 'system') => setSettings({ ...settings, theme: value })}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {THEMES.map((theme) => (
                        <SelectItem key={theme.value} value={theme.value}>
                          {theme.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-gray-500">
                    Choose your preferred theme. System will match your device settings.
                  </p>
                </div>
                
                <Button onClick={handleSaveSettings}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Appearance
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-gray-500">Receive notifications via email</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.notifications.email}
                      onChange={(e) => setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, email: e.target.checked }
                      })}
                      className="w-4 h-4"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Budget Alerts</p>
                      <p className="text-sm text-gray-500">Get notified when approaching budget limits</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.notifications.budgetAlerts}
                      onChange={(e) => setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, budgetAlerts: e.target.checked }
                      })}
                      className="w-4 h-4"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Weekly Reports</p>
                      <p className="text-sm text-gray-500">Receive weekly spending summaries</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.notifications.weeklyReports}
                      onChange={(e) => setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, weeklyReports: e.target.checked }
                      })}
                      className="w-4 h-4"
                    />
                  </div>
                </div>
                
                <Button onClick={handleSaveSettings}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Notifications
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy & Data Tab */}
          <TabsContent value="privacy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Data Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button onClick={handleExportData} variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export Data
                  </Button>
                  <Button onClick={handleImportData} variant="outline">
                    <Upload className="w-4 h-4 mr-2" />
                    Import Data
                  </Button>
                </div>
                
                <div className="border-t pt-4">
                  <h3 className="font-medium text-red-600 mb-2">Danger Zone</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                  <Button onClick={handleDeleteAccount} variant="destructive">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Avatar Selection Modal */}
      {showAvatarModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowAvatarModal(false)}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Choose Your Avatar</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAvatarModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-6">
              {/* Upload Option */}
              <div>
                <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">Upload Custom Avatar</h4>
                <Button
                  variant="outline"
                  onClick={handleUploadAvatar}
                  className="w-full"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Image (JPG, PNG, GIF - Max 2MB)
                </Button>
              </div>

              {/* Predefined Avatars */}
              <div>
                <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">Choose from Presets</h4>
                <div className="grid grid-cols-4 gap-4">
                  {PREDEFINED_AVATARS.map((avatar) => (
                    <div
                      key={avatar.id}
                      className="flex flex-col items-center space-y-2 cursor-pointer group"
                      onClick={() => handleSelectPredefinedAvatar(avatar.svg)}
                    >
                      <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-600 group-hover:border-blue-500 transition-colors">
                        <div
                          className="w-full h-full"
                          dangerouslySetInnerHTML={{ __html: avatar.svg }}
                        />
                      </div>
                      <span className="text-xs text-gray-600 dark:text-gray-400 text-center">
                        {avatar.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <Button
                variant="outline"
                onClick={() => setShowAvatarModal(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
